"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export const Header = () => {
  const router = useRouter();
  return (
    <header className="w-screen fixed z-50 px-6 py-2.5 bg-background border border-input">
      <div className="flex justify-between items-center">
        <div
          onClick={() => router.push("/")}
          className="text-2xl leading-9 font-semibold cursor-pointer"
        >
          Quiz app
        </div>
        <UserButton />
      </div>
    </header>
  );
};
