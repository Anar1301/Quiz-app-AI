"use client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

import { Button } from "../ui/button";

const Header = () => {
  return (
    <ClerkProvider>
      <div className="w-screen h-16 items-center flex border-b-2 fixed  bg-accent ">
        <div>
          <Link href="/">
            <div className=" font-semibold text-[16px] text-sm:text-[36px] items-center">
              Quiz app
            </div>
          </Link>
        </div>

        <div className="text-[26px] ml-300 ">
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton>
                <Button className="bg-white  text-black border-2">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </ClerkProvider>
  );
};

export default Header;
