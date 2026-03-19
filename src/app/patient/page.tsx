"use client"
import { useState, useRef, useEffect } from "react"

import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useChat } from "ai/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { format } from "date-fns"
import { BrainCircuit, Send, CalendarPlus, UserCheck, Video, AlertCircle, ArrowRight, Siren, Droplet, Heart, CheckCircle2, RefreshCcw, Mic, MicOff } from "lucide-react"

export default function PatientPortal() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isDonationScheduled, setIsDonationScheduled] = useState(false)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)

  const handleScheduleDonation = () => {
    setIsDonationScheduled(true)
    setTimeout(() => {
      setIsDonationModalOpen(false)
    }, 1500)
  }

  const { messages, input: aiInput, handleInputChange, handleSubmit, setInput } = useChat({
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Hello! I am Nova, your AI health assistant. Can you describe any symptoms you are experiencing today?' }
    ]
  })

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
      return
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in your browser. Please use Google Chrome or Safari.")
      return
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // Support all languages by letting the browser use the user's default or allowing it to detect.
    recognition.lang = navigator.language || 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      let currentTranscript = ''
      for (let i = 0; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript
      }
      if (currentTranscript) {
        setInput(currentTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error)
      if (event.error === 'network') {
        alert("Speech recognition failed due to a network error. Chrome requires an active internet connection for this feature.")
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (e) {
      console.error(e)
    }
  }

  // Prevent loading state while redirecting
  if (status === "loading") return <div className="p-8">Loading...</div>
  
  if (!session || session.user?.role !== "PATIENT") {
    redirect("/login")
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Patient Portal</h2>
        <p className="text-muted-foreground">Manage your health profile and seamlessly consult with our AI triage.</p>
      </div>

      <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-start gap-4 animate-in slide-in-from-top-4 font-sans">
        <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full relative">
          <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
          <Siren className="w-5 h-5 text-red-600 dark:text-red-400 relative z-10" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-red-900 dark:text-red-100 text-sm flex items-center">
            CRITICAL SHORTAGE: O- NEGATIVE BLOOD
            <span className="ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-black bg-red-600 text-white tracking-wider animate-pulse">Urgent</span>
          </h4>
          <p className="text-red-800/80 dark:text-red-300/80 text-xs mt-1">
            NovaCare Hospital is currently facing a critical shortage of O- blood. If you or someone you know is a universal donor, please visit the donation center immediately. Walk-ins accepted 24/7.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Left Col: Appointments & Profile */}
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Action Required</h4>
              <p className="text-blue-700/80 dark:text-blue-300/80 text-xs mt-1 mb-3">Please complete your health profile to ensure accurate AI triage and seamless booking.</p>
              <Button onClick={() => router.push('/patient/onboarding')} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                Complete Profile <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <Card className="shadow-sm border-blue-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center"><UserCheck className="w-5 h-5 mr-2 text-blue-500"/> Your Health Record</CardTitle>
              <CardDescription>Quick overview of your information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Patient ID:</span> <span className="font-medium">PT-2026-X8</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Blood Type:</span> <span className="font-medium">O+</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Allergies:</span> <span className="font-medium">Penicillin</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-cyan-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center"><CalendarPlus className="w-5 h-5 mr-2 text-cyan-500"/> Upcoming Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-xl text-sm border">
                <p className="font-semibold mb-1">Dr. Sarah Jenkins (Cardiology)</p>
                <p className="text-muted-foreground">{appointmentDate ? format(appointmentDate, "PPP") : "Pick a date"}, 10:00 AM</p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => router.push(`/room/A2`)} className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Join Call
                  </Button>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-muted h-9 px-3">
                      Reschedule
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={appointmentDate}
                        onSelect={(d) => {
                          setAppointmentDate(d)
                          setIsCalendarOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-red-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] pointer-events-none" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center"><Droplet className="w-5 h-5 mr-2 text-red-500 fill-red-500/20"/> Blood Donor Portal</CardTitle>
              <CardDescription>Manage your life-saving contributions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Your Blood Type</p>
                    <p className="text-2xl font-black text-red-600 dark:text-red-400">O+</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Donations</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                  Eligible to donate today. (Last donation: 6 mos ago)
                </div>

                <Dialog open={isDonationModalOpen} onOpenChange={setIsDonationModalOpen}>
                  <DialogTrigger 
                    disabled={isDonationScheduled}
                    className={`w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors disabled:pointer-events-none disabled:opacity-50 text-white shadow-md shadow-red-500/20 ${isDonationScheduled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {isDonationScheduled ? (
                      <><CheckCircle2 className="w-4 h-4 mr-2" /> Donation Scheduled</>
                    ) : (
                      <><Heart className="w-4 h-4 mr-2 fill-white" /> Schedule Donation</>
                    )}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-red-600"><Heart className="w-5 h-5 mr-2 fill-red-600"/> Schedule Blood Donation</DialogTitle>
                      <DialogDescription>
                        Thank you for choosing to donate blood at NovaCare. Your O+ blood is critically needed right now.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg font-medium text-sm border border-red-100 dark:border-red-900/50 text-red-900 dark:text-red-200">
                        You are eligible to donate. The next available slot is tomorrow at 9:00 AM.
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <Button variant="outline" onClick={() => setIsDonationModalOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleScheduleDonation} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDonationScheduled}
                      >
                        {isDonationScheduled ? "Confirmed!" : "Confirm Appointment"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: AI Symptom Checker Chat */}
        <Card className="md:col-span-1 lg:col-span-2 shadow-xl shadow-blue-500/5 border-blue-200/50 dark:border-blue-900/50 flex flex-col h-[600px]">
          <CardHeader className="border-b bg-blue-50/50 dark:bg-blue-950/20 rounded-t-xl pb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 shrink-0 shadow-md">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Nova AI Concierge</CardTitle>
                <CardDescription className="text-blue-600/80 dark:text-blue-400">Intelligent Symptom Triage & Booking</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((msg: any, i: number) => (
                  <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.content && (
                      <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' 
                          : 'bg-muted rounded-tl-sm border shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                    )}
                    {msg.toolInvocations?.map((toolInvocation: any, toolCallId: number) => {
                      if (toolInvocation.state === 'result') {
                        return (
                           <div key={toolCallId} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs w-[80%] text-slate-600 dark:text-slate-300 shadow-sm flex items-start gap-2 transition-all">
                              <BrainCircuit className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                              <div className="flex-1 overflow-hidden">
                                <p className="font-semibold mb-1 text-slate-700 dark:text-slate-200">System Query: {toolInvocation.toolName}</p>
                                <div className="font-mono bg-white dark:bg-slate-900/50 p-2 rounded-lg mt-1 overflow-x-auto text-[10px] break-all border border-slate-200 dark:border-slate-800">
                                  {JSON.stringify(toolInvocation.result, null, 2)}
                                </div>
                              </div>
                           </div>
                        );
                      } else {
                        return (
                          <div key={toolCallId} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs w-[80%] text-slate-500 animate-pulse flex items-center gap-2">
                             <RefreshCcw className="w-4 h-4 animate-spin text-blue-500 shrink-0" />
                             Querying secure hospital database for {toolInvocation.toolName}...
                          </div>
                        )
                      }
                    })}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t bg-muted/20">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input 
                value={aiInput}
                onChange={handleInputChange}
                placeholder="Describe your symptoms (e.g. 'I have a headache')..." 
                className="flex-1 rounded-full border-blue-200 dark:border-blue-800 transition-all focus-visible:ring-blue-500 focus-visible:border-blue-500"
              />
              <Button 
                type="button" 
                size="icon" 
                variant={isListening ? "destructive" : "secondary"}
                onClick={toggleListening}
                className={`rounded-full shrink-0 transition-all ${isListening ? 'animate-pulse' : ''}`}
                title={isListening ? "Stop listening" : "Start voice input (supports all languages)"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="sr-only">Voice Input</span>
              </Button>
              <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all shadow-md shrink-0">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
