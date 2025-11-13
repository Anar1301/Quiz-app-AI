"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";

const Login = () => {
  const { user } = useUser();
  console.log({ user });

  return <div>{user?.fullName}</div>;
};

export default Login;
