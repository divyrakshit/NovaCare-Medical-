"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplet, Heart, AlertCircle, CheckCircle2, Siren, ArrowRight } from "lucide-react";

export default function PatientBloodBankPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [urgency, setUrgency] = useState("NORMAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  if (status === "loading") return <div className="p-8">Loading...</div>;
  if (!session || session.user?.role !== "PATIENT") {
    // router.push("/login"); return null; // In real app
  }

  const handleRequestBlood = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/blood-bank/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: "patient_id_here", // Add actual patient ID from session
          bloodGroup,
          unitsRequired: parseInt(units),
          urgencyLevel: urgency,
          requestedBy: session?.user?.id,
        }),
      });
      if (res.ok) {
        setRequestSuccess(true);
        setBloodGroup("");
        setUnits("");
        setUrgency("NORMAL");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-red-950 dark:text-red-50">Blood Bank & Donation Services</h2>
        <p className="text-muted-foreground mt-1 text-lg">Request life-saving blood units or register to donate and become a hero.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Donor Registration Card */}
        <Card className="border-red-500/30 shadow-lg shadow-red-500/10 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-2xl flex items-center text-red-700 dark:text-red-400">
              <Heart className="w-6 h-6 mr-3 fill-red-500 text-red-500" />
              Be a Donor
            </CardTitle>
            <CardDescription className="text-base">Register as a voluntary blood donor and schedule your donation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-sm font-medium text-red-900 dark:text-red-100">You are eligible to donate. Last donation: None on record.</p>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:scale-[1.02] text-md h-12">
              <Droplet className="w-5 h-5 mr-2 fill-white" />
              Register to Donate
            </Button>
          </CardContent>
        </Card>

        {/* Request Blood Card */}
        <Card className="border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden relative">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-2xl flex items-center text-blue-700 dark:text-blue-400">
              <Siren className="w-6 h-6 mr-3 text-blue-500" />
              Request Blood
            </CardTitle>
            <CardDescription className="text-base">Submit an emergency or scheduled request for blood units.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            {requestSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-6 text-center animate-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 duration-300">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-2">Request Submitted</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">Your blood request has been successfully sent to the bank staff. You will be notified upon approval.</p>
                <Button variant="outline" onClick={() => setRequestSuccess(false)} className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/50 w-full">Make Another Request</Button>
              </div>
            ) : (
              <form onSubmit={handleRequestBlood} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blood Group</label>
                    <select
                      required
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    >
                      <option value="" disabled>Select Type</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Units Required</label>
                    <Input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 2"
                      value={units}
                      onChange={(e) => setUnits(e.target.value)}
                      className="bg-background/50 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High (Required in &lt; 24h)</option>
                    <option value="CRITICAL">Critical (Immediate extraction)</option>
                  </select>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 transition-all shadow-md">
                  {isSubmitting ? "Submitting..." : (
                    <>Submit Request <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
