import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewChart } from "@/components/overview-chart"
import { Activity, Users, CalendarDays, TrendingUp, Bed, Pill, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard (Final Year Demo)</h2>
        <p className="text-muted-foreground">Overview of hospital health, seeded with real data, and interactive analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="border-cyan-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">4 available slots</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Across 12 departments</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Monthly)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">+8% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full border-indigo-500/20 shadow-lg shadow-indigo-500/5">
          <CardHeader>
            <CardTitle className="flex items-center"><Bed className="w-5 h-5 mr-2 text-indigo-500"/> Real-Time Bed Availability Dashboard</CardTitle>
            <CardDescription>Live monitoring of hospital capacity across critical wards.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ICU Ward */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">Intensive Care (ICU)</h4>
                  <span className="text-xs font-mono bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">90% Full</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(20)].map((_, i) => (
                    <div key={`icu-${i}`} className={`h-8 rounded-md border ${i < 18 ? 'bg-red-500/20 border-red-500/50' : 'bg-green-500/20 border-green-500/50'}`} title={i < 18 ? 'Occupied' : 'Available'} />
                  ))}
                </div>
              </div>

              {/* General Ward */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400">General Ward</h4>
                  <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">45% Full</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(40)].map((_, i) => (
                    <div key={`gen-${i}`} className={`h-4 rounded-sm border ${i < 18 ? 'bg-blue-500/20 border-blue-500/50' : 'bg-green-500/20 border-green-500/50'}`} title={i < 18 ? 'Occupied' : 'Available'} />
                  ))}
                </div>
              </div>

              {/* Pediatrics */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400">Pediatrics</h4>
                  <span className="text-xs font-mono bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">75% Full</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(20)].map((_, i) => (
                    <div key={`ped-${i}`} className={`h-8 rounded-md border ${i < 15 ? 'bg-purple-500/20 border-purple-500/50' : 'bg-green-500/20 border-green-500/50'}`} title={i < 15 ? 'Occupied' : 'Available'} />
                  ))}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
        <Card className="col-span-full border-emerald-500/20 shadow-lg shadow-emerald-500/5 mt-4">
          <CardHeader>
            <CardTitle className="flex items-center"><Pill className="w-5 h-5 mr-2 text-emerald-500"/> Pharmacy & Inventory Status</CardTitle>
            <CardDescription>Monitor critical medication stock levels and auto-reorder status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Acetaminophen 500mg", stock: 12500, status: "Healthy", type: "Pain Relief", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { name: "Amoxicillin 250mg", stock: 840, status: "Low Stock", type: "Antibiotic", color: "text-amber-500", bg: "bg-amber-500/10", alert: true },
                { name: "Lisinopril 10mg", stock: 4200, status: "Healthy", type: "Blood Pressure", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { name: "Epinephrine Auto-Inj", stock: 12, status: "Critical", type: "Emergency", color: "text-red-500", bg: "bg-red-500/10", alert: true },
              ].map((med, i) => (
                <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${med.alert ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20' : 'bg-card'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${med.bg}`}>
                        <Pill className={`w-4 h-4 ${med.color}`} />
                      </div>
                      {med.status === "Critical" && <span className="flex items-center text-xs font-bold text-red-600 animate-pulse"><AlertTriangle className="w-3 h-3 mr-1"/> CRITICAL</span>}
                      {med.status === "Low Stock" && <span className="flex items-center text-xs font-medium text-amber-600"><AlertTriangle className="w-3 h-3 mr-1"/> Low</span>}
                      {med.status === "Healthy" && <span className="flex items-center text-xs font-medium text-emerald-600"><CheckCircle2 className="w-3 h-3 mr-1"/> Good</span>}
                    </div>
                    <h4 className="font-semibold text-sm leading-tight mb-1">{med.name}</h4>
                    <p className="text-xs text-muted-foreground">{med.type}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold tracking-tight">{med.stock.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">Units Remaining</p>
                    </div>
                    {med.alert && (
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2">Reorder</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
