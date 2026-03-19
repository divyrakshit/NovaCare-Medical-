import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seeding...")

  // Clean existing data for a fresh start
  console.log("Cleaning database...")
  await prisma.medicalRecord.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Users
  console.log("Creating Admin...")
  const adminUser = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@hospital.com",
      role: "ADMIN",
    }
  })

  console.log("Creating Doctors...")
  const docUser1 = await prisma.user.create({
    data: {
      name: "Dr. Sarah Jenkins",
      email: "doctor@hospital.com",
      role: "DOCTOR",
      doctor: {
        create: {
          specialization: "Cardiology",
          qualifications: "MD, FACC",
          experienceYears: 12,
          contactNumber: "555-0101",
        }
      }
    },
    include: { doctor: true }
  })

  const docUser2 = await prisma.user.create({
    data: {
      name: "Dr. Michael Chen",
      email: "chen@hospital.com",
      role: "DOCTOR",
      doctor: {
        create: {
          specialization: "Neurology",
          qualifications: "MD, PhD",
          experienceYears: 8,
          contactNumber: "555-0102",
        }
      }
    },
    include: { doctor: true }
  })

  const docUser3 = await prisma.user.create({
    data: {
      name: "Dr. Emily Rostova",
      email: "rostova@hospital.com",
      role: "DOCTOR",
      doctor: {
        create: {
          specialization: "Pediatrics",
          qualifications: "MD, FAAP",
          experienceYears: 15,
          contactNumber: "555-0103",
        }
      }
    },
    include: { doctor: true }
  })

  console.log("Creating Patients...")
  // The Demo Patient
  const patientUser1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "patient@hospital.com",
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1985-04-12"),
          gender: "Male",
          contactNumber: "555-0201",
          address: "123 Main St, Springfield",
          medicalHistory: "No major surgeries. Mild asthma.",
        }
      }
    },
    include: { patient: true }
  })

  // Additional mock patients for analytics
  const patientUsers = []
  for (let i = 0; i < 15; i++) {
    const p = await prisma.user.create({
      data: {
        name: `Patient ${i + 2}`,
        email: `patient${i + 2}@mock.com`,
        role: "PATIENT",
        patient: {
          create: {
            dateOfBirth: new Date(`19${70 + (i % 20)}-01-01`),
            gender: i % 2 === 0 ? "Male" : "Female",
            contactNumber: `555-02${i.toString().padStart(2, '0')}`,
          }
        }
      },
      include: { patient: true }
    })
    patientUsers.push(p)
  }

  console.log("Creating Appointments & Medical Records...")
  
  if (!docUser1.doctor || !patientUser1.patient) throw new Error("Missing relations for seeding")

  // Historical Records for the main patient
  await prisma.medicalRecord.create({
    data: {
      patientId: patientUser1.patient.id,
      doctorId: docUser1.doctor.id,
      diagnosis: "Hypertension (Mild)",
      treatment: "Prescribed ACE inhibitors. Recommended dietary changes.",
      notes: "Patient reports occasional dizziness. BP at 145/90.",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    }
  })

  await prisma.medicalRecord.create({
    data: {
      patientId: patientUser1.patient.id,
      doctorId: docUser2.doctor?.id || docUser1.doctor.id,
      diagnosis: "Migraine",
      treatment: "Sumatriptan 50mg PRN.",
      notes: "Triggers appear to be stress and lack of sleep.",
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
    }
  })

  // Upcoming appointments for today/tomorrow for Doctor 1
  await prisma.appointment.create({
    data: {
      patientId: patientUser1.patient.id,
      doctorId: docUser1.doctor.id,
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
      status: "SCHEDULED",
      notes: "Follow-up regarding blood pressure medication."
    }
  })

  await prisma.appointment.create({
    data: {
      patientId: patientUsers[0].patient!.id,
      doctorId: docUser1.doctor.id,
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      status: "SCHEDULED",
      notes: "Routine check-up"
    }
  })
  
  // Historical appointments to show in admin dashboard stats
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    await prisma.appointment.create({
      data: {
        patientId: patientUsers[i % patientUsers.length].patient!.id,
        doctorId: i % 2 === 0 ? docUser1.doctor.id : docUser2.doctor!.id,
        dateTime: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000), 
        status: "COMPLETED",
      }
    })
  }

  console.log("Database seeded successfully! 🌱")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
