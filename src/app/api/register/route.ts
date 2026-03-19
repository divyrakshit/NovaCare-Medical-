import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Create the user and their associated role record
    const userRole = role.toUpperCase()
    
    // Begin complex creation
    let newUser;
    
    if (userRole === "PATIENT") {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: userRole,
          patient: {
            create: {} // Create empty patient profile
          }
        }
      })
    } else if (userRole === "DOCTOR") {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: userRole,
          doctor: {
            create: {
              specialization: "General Practice", // Default, can be updated later
            }
          }
        }
      })
    } else {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: userRole,
        }
      })
    }

    return NextResponse.json({ message: "User registered successfully", user: { id: newUser.id, email: newUser.email, role: newUser.role } }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}
