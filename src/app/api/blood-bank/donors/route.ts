import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const donors = await prisma.bloodDonor.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    return NextResponse.json(donors);
  } catch (error) {
    console.error("[BLOOD_DONORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, bloodGroup, isAvailable } = body;

    const donor = await prisma.bloodDonor.create({
      data: {
        userId,
        bloodGroup,
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json(donor);
  } catch (error) {
    console.error("[BLOOD_DONORS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
