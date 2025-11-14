"use client";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { History } from "@/lib/types";
import { useUser } from "@clerk/nextjs";

export function AppSidebar() {
  const router = useRouter();
  const { user } = useUser();

  const [history, SetHistory] = useState<History[]>([]);
  const getHistory = async () => {
    if (!user) {
      return;
    }
    const result = await fetch("/api/generate/summary");

    const responseData = await result.json();

    const { data } = responseData;

    SetHistory(data);
  };
  useEffect(() => {
    getHistory();
  }, [user]);

  const HistoryOnclick = async (data: { id: string }) => {
    const ID = data.id;
    router.push(`/history?search=${ID}`);
  };
  const DeleteTitle = async (data: { id: string }) => {
    if (confirm("Are u sure ?") === true) {
      const ID = data.id;

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/history/DeleteHistory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ID }),
        cache: "no-store",
      });
      getHistory();
      return response;
    } else {
      return;
    }
  };

  return (
    <Sidebar className="mt-16 ">
      <div className="flex items-center mx-4 justify-between  gap-20 mt-4 ">
        <div className="font-extrabold h-7">History</div>
        <SidebarTrigger className="h-6 w-6 " />
      </div>

      <SidebarHeader />
      <SidebarContent>
        <div className="mx-4">
          {history && (
            <div>
              {history.map((data, index) => (
                <div key={index} className="h-6 font-semibold my-2 ">
                  <div className="flex w-[223px] justify-between">
                    <div onClick={() => HistoryOnclick(data)}>{data.title}</div>
                    <img
                      onClick={() => DeleteTitle(data)}
                      src="/delete.svg
                  "
                    ></img>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
