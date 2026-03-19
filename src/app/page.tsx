"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Calendar, ShieldPlus, BrainCircuit, Video, FileText, Bed, ArrowRight } from "lucide-react"

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full max-w-lg mx-auto pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            <BrainCircuit className="w-4 h-4 mr-2" />
            AI-Powered Healthcare Management
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            The Future of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
              Modern Medicine
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            NovaCare integrates advanced AI to streamline hospital operations, empower doctors, and provide exceptional patient experiences from booking to recovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full text-md bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/25">
                Access Portal
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full text-md hover:scale-105 transition-all">
                Explore Features
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">A Complete Healthcare Ecosystem</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage a modern hospital effectively, amplified by intelligence.
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Activity className="w-8 h-8 text-blue-500" />,
                title: "Smart EMR System",
                description: "Electronic Medical Records with AI-generated summaries of patient history for rapid consultations.",
                link: "/doctor",
                color: "group-hover:text-blue-500"
              },
              {
                icon: <Calendar className="w-8 h-8 text-cyan-500" />,
                title: "Intelligent Scheduling",
                description: "Automated appointment booking that optimizes doctor availability and minimizes patient wait times.",
                link: "/patient",
                color: "group-hover:text-cyan-500"
              },
              {
                icon: <ShieldPlus className="w-8 h-8 text-indigo-500" />,
                title: "AI Symptom Checker",
                description: "An integrated chatbot that triages patient symptoms and recommends the right department before booking.",
                link: "/patient",
                color: "group-hover:text-indigo-500"
              },
              {
                icon: <Video className="w-8 h-8 text-green-500" />,
                title: "Telemedicine Rooms",
                description: "Integrated WebRTC video consultations allowing doctors and patients to connect seamlessly.",
                link: "/patient",
                color: "group-hover:text-green-500"
              },
              {
                icon: <FileText className="w-8 h-8 text-purple-500" />,
                title: "AI Prescriptions",
                description: "Auto-drafted medical prescriptions powered by AI, instantly exportable as pristine PDF documents.",
                link: "/doctor",
                color: "group-hover:text-purple-500"
              },
              {
                icon: <Bed className="w-8 h-8 text-red-500" />,
                title: "Real-Time Bed Monitor",
                description: "Live, animated dashboard tracking hospital capacity across ICU, General, and Pediatric wards.",
                link: "/admin",
                color: "group-hover:text-red-500"
              }
            ].map((feature, i) => (
              <Link href={feature.link} key={i} className="group block h-full">
                <motion.div 
                  variants={item as any}
                  className="bg-card p-8 rounded-3xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative overflow-hidden h-full flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="mb-6 p-4 bg-background rounded-2xl w-max border shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 transition-colors ${feature.color}`}>{feature.title}</h3>
                  <p className="text-muted-foreground flex-1">{feature.description}</p>
                  
                  <div className={`mt-6 flex items-center text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${feature.color}`}>
                    Experience Feature <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
