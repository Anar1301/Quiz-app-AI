"use client";

import { useUser } from "@clerk/nextjs";
import { AppSidebar, Header } from "../_components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { UserResource } from "@clerk/shared/index-DUJxisRL";
import { toast } from "sonner";
import { UserType } from "@/lib/types";
import { Toaster } from "@/components/ui";
import { ArticleProvider } from "../_providers/ArticleProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [quizAppUser, setQuizAppUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
    }

    if (isLoaded && user) {
      registerUser(user);
    }
  }, [isLoaded, user]);

  const registerUser = async (user: UserResource) => {
    if (!user) {
      toast.warning("Missing required fields!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.firstName,
        }),
      });

      if (!response.ok) {
        toast("Failed to register user!");
      }

      if (response.status === 400) {
        //asdasd
      }

      const { data } = await response.json();
      toast.success("User registered successfully");
      if (data) {
        setQuizAppUser(data);
      }
    } catch (error) {
      console.error("Error while registering user!", error);
      toast.error("Something went wrong while registering user!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex">
        <div className="w-full h-full flex items-center justify-center gap-1.5">
          <AiOutlineLoading className="animate-spin" size={24} />
          <div className="text-2xl leading-8 font-semibold text-foreground">
            Loading
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex">
      <ArticleProvider>
        <>
          <AppSidebar />
          <Header />
          {children}
          <Toaster position="top-center" />
        </>
      </ArticleProvider>
    </div>
  );
}
