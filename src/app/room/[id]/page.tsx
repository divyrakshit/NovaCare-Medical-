"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare } from "lucide-react"

export default function TelemedicineRoom({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (status === "loading") return <div className="p-8">Connecting to secure room...</div>
  if (!session) {
    redirect("/login")
  }

  const isDoctor = session.user.role === "DOCTOR"
  const partnerName = isDoctor ? "Michael Scott (Patient)" : "Dr. Sarah Jenkins (Cardiology)"

  const endCall = () => {
    router.push(isDoctor ? "/doctor" : "/patient")
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
            <span className="text-zinc-100 font-medium">Live Consultation</span>
          </div>
          <span className="text-zinc-400 text-sm font-mono bg-zinc-800 px-2 py-1 rounded">
            {formatTime(time)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Users className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 p-4 flex gap-4 overflow-hidden relative">
        {/* Main Video (Partner) */}
        <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 relative overflow-hidden flex items-center justify-center">
          {/* Simulated Video Feed Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/20 to-zinc-950/80 pointer-events-none" />
          <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-4xl font-light shadow-2xl">
            {partnerName.charAt(0)}
          </div>
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-sm font-medium">
            {partnerName}
          </div>
        </div>

        {/* Small Video (Self) */}
        <div className="w-64 h-48 bg-zinc-800 rounded-xl border-2 border-zinc-700 absolute bottom-8 py-4 right-8 overflow-hidden flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer">
           {isVideoOff ? (
             <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-xl font-light">
               {session.user.name?.charAt(0) || "U"}
             </div>
           ) : (
             <video 
               className="object-cover w-full h-full"
               autoPlay 
               playsInline 
               muted 
               ref={video => {
                 if (video && !video.srcObject) {
                   navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                     .then(stream => video.srcObject = stream)
                     .catch(console.error)
                 }
               }}
             />
           )}
           <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-xs">
             You {isMuted && "(Muted)"}
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-zinc-950 flex items-center justify-center space-x-4">
        <Button 
          variant={isMuted ? "destructive" : "outline"} 
          size="icon" 
          className="w-14 h-14 rounded-full border-zinc-700 hover:bg-zinc-800 active:scale-95 transition-all text-white"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-zinc-100" />}
        </Button>

        <Button 
          variant={isVideoOff ? "destructive" : "outline"} 
          size="icon" 
          className="w-14 h-14 rounded-full border-zinc-700 hover:bg-zinc-800 active:scale-95 transition-all text-white"
          onClick={() => setIsVideoOff(!isVideoOff)}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6 text-zinc-100" />}
        </Button>

        <Button 
          variant="destructive" 
          size="icon" 
          className="w-16 h-16 rounded-full ml-4 shadow-lg shadow-red-500/20 active:scale-95 transition-all"
          onClick={endCall}
        >
          <PhoneOff className="w-7 h-7" />
        </Button>
      </div>
    </div>
  )
}
