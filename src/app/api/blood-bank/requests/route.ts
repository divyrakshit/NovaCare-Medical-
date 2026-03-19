import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.bloodRequest.findMany({
      include: {
        patient: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("[BLOOD_REQUESTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, bloodGroup, unitsRequired, urgencyLevel, requestedBy } = body;

    const request = await prisma.bloodRequest.create({
      data: {
        patientId,
        bloodGroup,
        unitsRequired,
        urgencyLevel: urgencyLevel || "NORMAL",
        requestedBy,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error("[BLOOD_REQUESTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const currentRequest = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!currentRequest) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updatedRequest = await prisma.bloodRequest.update({
      where: { id },
      data: { status },
    });

    // If a request is fulfilled, decrement the inventory
    if (status === "FULFILLED" && currentRequest.status !== "FULFILLED") {
      await prisma.bloodInventory.update({
        where: { bloodGroup: updatedRequest.bloodGroup },
        data: { unitsAvailable: { decrement: updatedRequest.unitsRequired } }
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("[BLOOD_REQUESTS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
