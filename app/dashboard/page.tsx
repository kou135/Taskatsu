"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function Dashboard() {
    console.log("Dashboard component rendered - Step 1"); // デバッグ用
    const { data: session, status } = useSession();
    const [date, setDate] = useState<Date>();
    const [taskType, setTaskType] = useState<string>("");

    // 認証状態をチェック
    if (status === "loading") {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg">読み込み中...</div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
                    <p className="text-gray-600 mb-4">ダッシュボードにアクセスするにはログインしてください。</p>
                    <Button onClick={() => window.location.href = '/'}>
                        ホームに戻る
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">就活タスク管理</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            ようこそ、{session?.user?.name || session?.user?.email}さん
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            ログアウト
                        </Button>
                    </div>
                </div>
                
                {/* タスク作成フォーム */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6">新しいタスクを作成</h2>
                    
                    <div className="space-y-6">
                        {/* 企業名入力 */}
                        <div>
                            <Label htmlFor="company">企業名</Label>
                            <Input 
                                id="company" 
                                placeholder="例: 株式会社サンプル" 
                                className="mt-1"
                            />
                        </div>

                        {/* タスクタイプ選択 */}
                        <div>
                            <Label>タスクタイプ</Label>
                            <RadioGroup 
                                value={taskType} 
                                onValueChange={setTaskType}
                                className="mt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="es" id="es" />
                                    <Label htmlFor="es">ES</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="web-test" id="web-test" />
                                    <Label htmlFor="web-test">Webテスト</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="interview" id="interview" />
                                    <Label htmlFor="interview">面接</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* 期限設定 */}
                        <div>
                            <Label>期限</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal mt-1"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: ja }) : "期限を選択"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* 添付欄 */}
                        <div>
                            <Label htmlFor="attachment">添付情報（任意）</Label>
                            <Input 
                                id="attachment" 
                                placeholder="例: マイページURL、メモなど" 
                                className="mt-1"
                            />
                        </div>

                        {/* 作成ボタン */}
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            タスクを作成する
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}