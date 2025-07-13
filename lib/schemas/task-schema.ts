import { z } from "zod";

// タスクタイプの定義
export const taskTypeSchema = z.enum(["es", "web-test", "interview"]);

// タスク作成フォームのスキーマ
export const createTaskSchema = z.object({
  company: z
    .string()
    .min(1, "企業名は必須です")
    .max(100, "企業名は100文字以内で入力してください"),
  
  taskType: taskTypeSchema,
  
  deadline: z
    .date({
      required_error: "期限を選択してください",
      invalid_type_error: "有効な日付を選択してください",
    })
    .min(new Date(), "期限は今日以降の日付を選択してください"),
  
  attachment: z
    .string()
    .max(500, "添付情報は500文字以内で入力してください")
    .optional(),
});

// 型定義のエクスポート
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type TaskType = z.infer<typeof taskTypeSchema>;