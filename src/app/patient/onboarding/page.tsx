"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, ChevronLeft, HeartPulse, ShieldAlert, Activity } from "lucide-react"

const steps = [
  { id: 1, title: "Personal Details", icon: <CheckCircle2 className="w-5 h-5" /> },
  { id: 2, title: "Medical History", icon: <HeartPulse className="w-5 h-5" /> },
  { id: 3, title: "Insurance & Emergency", icon: <ShieldAlert className="w-5 h-5" /> }
]

export default function PatientOnboarding() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (status === "loading") return <div className="p-8">Loading...</div>

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/patient")
    }, 1500)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/20 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="text-muted-foreground">Welcome {session?.user?.name}, let's get you set up in NovaCare.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600" 
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          {steps.map((step) => (
            <div key={step.id} className={`relative z-10 flex flex-col items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${currentStep >= step.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-background border-muted-foreground/30 text-muted-foreground'}`}>
              {step.icon}
              <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${currentStep >= step.id ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <Card className="border-border/50 shadow-xl overflow-hidden bg-background">
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 absolute inset-0 space-y-6"
                >
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Basic information for your medical record.</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input id="gender" placeholder="e.g. Female, Male, Non-binary" className="bg-muted/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Home Address</Label>
                      <Textarea id="address" placeholder="123 Health Ave..." className="bg-muted/50" />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 absolute inset-0 space-y-6"
                >
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Medical History</CardTitle>
                    <CardDescription>Help us understand your health background.</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Known Allergies</Label>
                      <Input id="allergies" placeholder="e.g. Penicillin, Peanuts (or 'None')" className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea id="medications" placeholder="List any ongoing prescriptions..." className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conditions">Chronic Conditions</Label>
                      <Input id="conditions" placeholder="e.g. Asthma, Hypertension" className="bg-muted/50" />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 absolute inset-0 space-y-6"
                >
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Insurance & Emergency</CardTitle>
                    <CardDescription>Final step to complete your profile.</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider">Insurance Provider</Label>
                        <Input id="provider" placeholder="e.g. BlueCross" className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy">Policy Number</Label>
                        <Input id="policy" placeholder="XXX-XXXX-XX" className="bg-muted/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                      <Input id="emergency_name" placeholder="Name" className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                      <Input id="emergency_phone" type="tel" placeholder="(555) 000-0000" className="bg-muted/50" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <CardFooter className="bg-muted/30 border-t p-6 flex justify-between relative z-10">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20">
                {isSubmitting ? (
                  <span className="flex items-center"><Activity className="w-4 h-4 mr-2 animate-spin" /> Saving Profile...</span>
                ) : (
                  <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Complete Registration</span>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
