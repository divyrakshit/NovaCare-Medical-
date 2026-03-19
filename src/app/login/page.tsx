"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid credentials")
        setIsLoading(false)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("An error occurred during sign in")
      setIsLoading(false)
    }
  }

  // Helper values for demonstration
  const setDemoCredentials = (role: 'admin' | 'doctor' | 'patient') => {
    if (role === 'admin') { setEmail("admin@hospital.com"); setPassword("admin123") }
    if (role === 'doctor') { setEmail("doctor@hospital.com"); setPassword("doctor123") }
    if (role === 'patient') { setEmail("patient@hospital.com"); setPassword("patient123") }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <BrainCircuit className="w-8 h-8" />
          </div>
        </div>
        
        <Card className="border-border/50 shadow-xl shadow-blue-500/5">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your NovaCare portal account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@hospital.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all focus-visible:ring-blue-500"
                />
              </div>
              
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-6 text-sm text-muted-foreground w-full">
            <p className="text-center w-full">Demo Accounts:</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setDemoCredentials('admin')} className="text-xs">Admin</Button>
              <Button variant="outline" size="sm" onClick={() => setDemoCredentials('doctor')} className="text-xs">Doctor</Button>
              <Button variant="outline" size="sm" onClick={() => setDemoCredentials('patient')} className="text-xs">Patient</Button>
            </div>
            
            <div className="pt-4 mt-2 border-t border-border/50 w-full flex flex-col gap-2">
               <p className="text-center w-full">Looking to create a new profile?</p>
               <Button variant="secondary" className="w-full" onClick={() => router.push("/register")}>
                  Register New Account
               </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
