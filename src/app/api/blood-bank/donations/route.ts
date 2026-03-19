import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const donations = await prisma.bloodDonation.findMany({
      include: {
        donor: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("[BLOOD_DONATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { donorId, bloodGroup, volumeMl, status } = body;

    const donation = await prisma.bloodDonation.create({
      data: {
        donorId,
        bloodGroup,
        volumeMl: volumeMl || 450,
        status: status || "COMPLETED",
      },
    });

    // Update the donor's stats
    await prisma.bloodDonor.update({
      where: { id: donorId },
      data: {
        totalDonations: { increment: 1 },
        lastDonation: new Date()
      }
    });

    // Automatically increase blood inventory if donation is completed
    if (donation.status === "COMPLETED") {
      await prisma.bloodInventory.upsert({
        where: { bloodGroup: donation.bloodGroup },
        update: { unitsAvailable: { increment: 1 } },
        create: { bloodGroup: donation.bloodGroup, unitsAvailable: 1 },
      });
    }

    return NextResponse.json(donation);
  } catch (error) {
    console.error("[BLOOD_DONATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
