"use client";
import { SignIn } from "@clerk/nextjs";
import React from "react";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <SignIn routing={"hash"} />
    </div>
  );
};
export default LoginPage;
