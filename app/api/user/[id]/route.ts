import { prisma } from "@/lib/client";
import { type UserProfile } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const res = await params;
    const id = res.id;

    let user = await prisma.user.findUnique({ where: { id } });
    let profile: UserProfile;

    if (!user) {
      user = await prisma.user.create({ data: { id } });
      profile = await prisma.userProfile.create({ data: { userId: id } });
    } else {
      profile = await prisma.userProfile.findUnique({ where: { userId: id } });
    }
    // console.log("USER BCKEND: ", user);

    return NextResponse.json({ user, profile }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500 });
  }
}
