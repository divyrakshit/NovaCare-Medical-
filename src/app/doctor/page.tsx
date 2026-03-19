"use client"
import { useState, useRef } from "react"

import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, FileText, Sparkles, Video, Download, Mic, MicOff, Loader2 } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function DoctorPortal() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [prescriptionText, setPrescriptionText] = useState("")
  const [prescriptionOpen, setPrescriptionOpen] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  const [isDictating, setIsDictating] = useState(false)
  const [dictationText, setDictationText] = useState("")
  const [dictationOpen, setDictationOpen] = useState(false)
  const [isProcessingNote, setIsProcessingNote] = useState(false)
  const recognitionRef = useRef<any>(null)

  if (status === "loading") return <div className="p-8">Loading...</div>
  if (!session || session.user?.role !== "DOCTOR") {
    redirect("/login")
  }

  const appointments = [
    { id: "A1", time: "09:00 AM", patient: "Michael Scott", type: "Follow-up", status: "Waiting" },
    { id: "A2", time: "09:45 AM", patient: "Jim Halpert", type: "Check-up", status: "Scheduled" },
    { id: "A3", time: "10:30 AM", patient: "Pam Beesly", type: "Consultation", status: "Scheduled" },
  ]

  const startDictation = () => {
    if (typeof window === "undefined") return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Try Chrome.")
      return
    }
    
    const recognition = new SpeechRecognition()
    // Support all languages by default
    recognition.lang = navigator.language || 'en-US'
    recognition.continuous = true
    recognition.interimResults = true
    
    recognition.onstart = () => setIsDictating(true)
    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setDictationText((prev) => prev + " " + finalTranscript)
      }
    }
    recognition.onerror = () => setIsDictating(false)
    recognition.onend = () => setIsDictating(false)
    
    recognition.start()
    recognitionRef.current = recognition
  }
  
  const stopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsDictating(false)
    }
  }

  const handleProcessNote = () => {
    setIsProcessingNote(true)
    setTimeout(() => {
      setDictationText((prev) => `[AI Formatted Clinical Note]\nDate: ${new Date().toLocaleDateString()}\n\nSubjective:\n${prev.trim() || 'No dictation recorded.'}\n\nObjective:\nPatient appears stable. Vitals wnl.\n\nAssessment:\nReview of symptoms matches dictation.\n\nPlan:\nContinue current care plan.`)
      setIsProcessingNote(false)
    }, 1500)
  }

  const handleGeneratePrescription = () => {
    setIsGenerating(true)
    setPrescriptionText("")
    
    // Simulate AI Streaming carefully
    const aiResponse = "Patient: Michael Scott\nDate: March 15, 2026\n\nDiagnosis: Mild concussion (resolving), stable blood pressure.\n\nRx:\n1. Acetaminophen 500mg - Take 1 tablet every 6 hours as needed for headache. Do not exceed 4 tablets in 24 hours.\n2. Rest and hydration. Avoid bright screens for prolonged periods over the next 48 hours.\n\nFollow-up: Call clinic if symptoms worsen or nausea occurs.\n\nNovaCare Medical AI Assisting Dr. " + session?.user?.name
    
    let i = 0
    const interval = setInterval(() => {
      setPrescriptionText((prev) => prev + aiResponse.charAt(i))
      i++
      if (i >= aiResponse.length) {
        clearInterval(interval)
        setIsGenerating(false)
      }
    }, 20)
  }

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return
    const canvas = await html2canvas(pdfRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save("NovaCare_Prescription_MichaelScott.pdf")
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Doctor Portal</h2>
          <p className="text-muted-foreground">Welcome back, {session.user.name}. Here is your schedule for today.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dictationOpen} onOpenChange={setDictationOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-blue-500/50 bg-transparent text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-9 px-3" onClick={() => setDictationText("")}>
              <Mic className="w-4 h-4 mr-2" />
              Dictate Note
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center"><Mic className="w-5 h-5 mr-2 text-blue-500"/> AI Clinical Dictation</DialogTitle>
                <DialogDescription>Speak clearly into your microphone. AI will format your note when finished.</DialogDescription>
              </DialogHeader>
              
              <div className="flex justify-center py-6">
                <Button 
                  onClick={isDictating ? stopDictation : startDictation}
                  size="lg"
                  className={`w-24 h-24 rounded-full transition-all duration-300 ${
                    isDictating 
                      ? "bg-red-500 hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110" 
                      : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 border border-blue-500/30 hover:bg-blue-200"
                  }`}
                >
                  {isDictating ? <Mic className="w-10 h-10 text-white animate-pulse" /> : <Mic className="w-10 h-10" />}
                </Button>
              </div>
              
              <Textarea 
                value={dictationText} 
                onChange={(e) => setDictationText(e.target.value)}
                className="min-h-[200px] bg-muted/50 text-sm leading-relaxed" 
                placeholder="Microphone transcript will appear here..."
              />

              <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
                <div className="text-xs text-muted-foreground flex items-center">
                  {isDictating ? <span className="flex items-center text-red-500"><span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"/> Recording...</span> : "Microphone off"}
                </div>
                <Button disabled={isProcessingNote || !dictationText || isDictating} onClick={handleProcessNote} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {isProcessingNote ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2"/>}
                  Format with AI
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500"/> Today's Appointments</CardTitle>
            <CardDescription>You have 3 appointments remaining today.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.time}</TableCell>
                    <TableCell>{apt.patient}</TableCell>
                    <TableCell>{apt.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'Waiting' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {apt.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end space-x-2">
                      <Dialog open={prescriptionOpen} onOpenChange={setPrescriptionOpen}>
                        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-muted h-9 px-3" onClick={() => { setPrescriptionOpen(true); if(!prescriptionText) handleGeneratePrescription(); }}>
                          <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                          Rx
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-500"/> AI Drafted Prescription</DialogTitle>
                            <DialogDescription>Review and download the generated prescription.</DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Textarea 
                              value={prescriptionText} 
                              onChange={(e) => setPrescriptionText(e.target.value)}
                              className="min-h-[250px] font-mono text-sm leading-relaxed" 
                              placeholder="Generating..."
                            />
                          </div>
                          <DialogFooter>
                            <Button disabled={isGenerating} onClick={handleDownloadPDF} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                              {isGenerating ? <span className="animate-pulse">AI is writing...</span> : <><Download className="w-4 h-4 mr-2"/> Download Official PDF</>}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button onClick={() => router.push(`/room/${apt.id}`)} className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20" size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Join Call
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="w-5 h-5 mr-2 text-indigo-500"/> AI EMR Summaries</CardTitle>
            <CardDescription>Recent patient history summarized.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center mb-2">
                <Sparkles className="w-3 h-3 mr-1" /> For Michael Scott (09:00 AM)
              </h4>
              <p className="text-sm text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                Patient returns for 2-week follow up post mild concussion. Reports headaches subsided. Blood pressure was slightly elevated last visit (135/85).
              </p>
            </div>
            <Button variant="ghost" className="w-full text-sm text-blue-600">View all summaries →</Button>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Div for PDF Generation to ensure pristine formatting */}
      <div className="fixed top-[-9999px] left-[-9999px]">
        <div ref={pdfRef} className="w-[800px] p-12 bg-white text-black font-sans">
          <div className="flex justify-between items-center border-b-2 border-blue-600 pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">NovaCare Medical</h1>
              <p className="text-gray-500 text-sm mt-1">123 Health Ave, Metropolis, NY</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold">Dr. {session?.user?.name}</h2>
              <p className="text-gray-500 text-sm">{session?.user?.email}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Name:</strong> Michael Scott</p>
              <p><strong>Date:</strong> March 15, 2026</p>
              <p><strong>ID:</strong> PT-0021-X</p>
              <p><strong>DOB:</strong> March 15, 1965</p>
            </div>
          </div>
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-4 text-blue-800">Prescription Output</h3>
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed p-6 border-l-4 border-blue-500 bg-blue-50/30">
              {prescriptionText}
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-end">
            <p className="text-xs text-gray-400">Generated by Nova AI • Secure Document</p>
            <div className="text-center">
              <div className="w-48 border-b border-black mb-2 px-4 py-2 font-cursive text-xl text-blue-900">
                {session?.user?.name}
              </div>
              <p className="text-sm font-semibold">Physician Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
