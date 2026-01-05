import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { clerkId, email, name } = await request.json();

  if (!clerkId || !email || !name) {
    return NextResponse.json(
      { error: "Missing required fields!" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.users.findUnique({
    where: { clerkid: clerkId },
  });

  if (existingUser?.clerkid !== clerkId) {
    await prisma.users.create({
      data: { clerkid: clerkId, email: email, name: name },
    });
  }

  const user = await prisma.users.findUnique({
    where: {
      clerkid: clerkId,
    },
  });

  return NextResponse.json({
    message: "User registered successfully",
    data: user,
  });
}

export async function GET() {
  const users = await prisma.users.findMany();
  return Response.json(users);
}
