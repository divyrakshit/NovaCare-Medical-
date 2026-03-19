import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Perform a raw ping to the database
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;
    
    return NextResponse.json({
      status: "operational",
      database: "connected",
      latencyMs: latency,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[SYSTEM_STATUS_API]", error);
    return NextResponse.json({
      status: "degraded",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
