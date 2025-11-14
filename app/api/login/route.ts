import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log({ body });

    const DeployUser = await prisma.user.upsert({
      where: {
        email: body.primaryEmailAddress.emailAddress,
      },
      update: {
        name: body.fullName,
        clerk_id: body.id,
      },
      create: {
        clerk_id: body.id,
        email: body.primaryEmailAddress.emailAddress,
        name: body.fullName,
      },
    });

    console.log({ DeployUser });

    return NextResponse.json({
      message: "Хэрэглэгч амжилттай үүссэн эсвэл шинэчлэгдсэн.",
      data: DeployUser,
    });
  } catch (err: any) {
    console.error("POST /api/login error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
