"use client";
import { useEffect, useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function HistoryDrawer({
  userId,
}: {
  userId: number | null | string;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!userId) return;
    setLoading(true);

    const res = await fetch(`/api/history/user?userId=${userId}`);
    const data = await res.json();

    setHistory(data.data?.attempts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button>History</Button>
      </DrawerTrigger>
      <DrawerContent className="p-6">
        <DialogTitle></DialogTitle>
        <h2 className="text-xl font-semibold mb-4">📜 Тестийн оролдлогууд</h2>
        {loading ? (
          <p>Татаж байна...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">Одоогоор оролдлого алга байна.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {history.map((attempt, i) => (
              <div key={attempt.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">🧠 Оролдлого {i + 1}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(attempt.createdat).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  Оноо:{" "}
                  <b>
                    {attempt.score}/{attempt.quizanswer.length}
                  </b>{" "}
                  | ⏱ Цаг: {attempt.timespent}s
                </p>
                <details className="mt-3">
                  <summary className="cursor-pointer text-blue-500">
                    Хариултууд
                  </summary>
                  <div className="mt-2 space-y-1">
                    {attempt.quizanswer.map((a: any, idx: number) => (
                      <div key={idx} className="text-sm border-b pb-1">
                        <p>
                          <b>Q{idx + 1}:</b> {a.question}
                        </p>
                        <p
                          className={`ml-4 ${
                            a.iscorrect ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          Таны хариулт: {a.selected} (
                          {a.iscorrect ? "Зөв" : "Буруу"})
                        </p>
                        {!a.iscorrect && (
                          <p className="ml-4 text-gray-500">
                            Зөв хариулт: {a.correct}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
