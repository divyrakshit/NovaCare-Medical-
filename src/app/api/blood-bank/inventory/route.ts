import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventory = await prisma.bloodInventory.findMany();
    return NextResponse.json(inventory);
  } catch (error) {
    console.error("[BLOOD_INVENTORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bloodGroup, unitsAvailable } = body;

    const inventory = await prisma.bloodInventory.upsert({
      where: { bloodGroup },
      update: { unitsAvailable },
      create: { bloodGroup, unitsAvailable },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("[BLOOD_INVENTORY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
