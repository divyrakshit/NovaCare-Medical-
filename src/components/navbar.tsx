import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              NovaCare Medical
            </span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <div className="text-sm font-medium mr-4">
                  Welcome, {session.user?.name} <span className="text-muted-foreground ml-1">({session.user?.role})</span>
                </div>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin"><Button variant="ghost">Admin Dashboard</Button></Link>
                )}
                {session.user?.role === "DOCTOR" && (
                  <Link href="/doctor"><Button variant="ghost">Doctor Portal</Button></Link>
                )}
                {session.user?.role === "PATIENT" && (
                  <Link href="/patient"><Button variant="ghost">Patient Portal</Button></Link>
                )}
                <form action={async () => {
                  "use server"
                  await signOut()
                }}>
                  <Button variant="outline" type="submit">Sign Out</Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
