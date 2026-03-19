import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Normally we'd check the DB, but for this demo, we can use a mock check
        // or check against the exact string to allow easy testing
        if (credentials.email === "admin@hospital.com" && credentials.password === "admin123") {
          return { id: "1", name: "Admin User", email: "admin@hospital.com", role: "ADMIN" }
        }
        if (credentials.email === "doctor@hospital.com") {
          return { id: "2", name: "Dr. Smith", email: "doctor@hospital.com", role: "DOCTOR" }
        }
        if (credentials.email === "patient@hospital.com") {
          return { id: "3", name: "John Doe", email: "patient@hospital.com", role: "PATIENT" }
        }

        // Try getting from DB for real registration fallback
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) return null

        // Check hashed password if user has one
        if (user.passwordHash) {
          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
          if (!isPasswordValid) return null;
        } else {
          // No password hash means this user is from seed but not handled by hardcode above
          return null;
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string
      }
      return session
    }
  }
})
