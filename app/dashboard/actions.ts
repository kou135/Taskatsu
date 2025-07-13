"use server";

import { kv } from "@/lib/kv";
import { CreateTaskInput, Task } from "@/lib/types/task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createTask(formData: CreateTaskInput): Promise<{ success: boolean; error?: string }> {
  try {
    // セッションからユーザーIDを取得
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "認証が必要です" };
    }

    // タスクIDを生成
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 現在の日時
    const now = new Date();
    
    // タスクオブジェクトを作成
    const task: Task = {
      id: taskId,
      userId: session.user.email,
      company: formData.company,
      taskType: formData.taskType,
      deadline: formData.deadline,
      attachment: formData.attachment || "",
      createdAt: now,
      updatedAt: now,
    };

    // Vercel KVに保存
    await kv.set(`task:${taskId}`, JSON.stringify(task));
    
    return { success: true };
  } catch (error) {
    console.error("タスク作成エラー:", error);
    return { success: false, error: "タスクの作成に失敗しました" };
  }
}