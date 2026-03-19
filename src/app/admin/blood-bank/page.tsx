"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Droplet, Heart, Thermometer, List, CheckCircle } from "lucide-react";

export default function AdminBloodBankDashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, reqRes] = await Promise.all([
        fetch("/api/blood-bank/inventory"),
        fetch("/api/blood-bank/requests")
      ]);
      const invData = await invRes.json();
      const reqData = await reqRes.json();
      setInventory(invData);
      setRequests(reqData);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRequest = async (id: string) => {
    try {
      const res = await fetch("/api/blood-bank/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "APPROVED" })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error approving request", error);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blood Bank Administration</h2>
          <p className="text-muted-foreground mt-1">Manage hospital blood inventory, donations, and emergency requests.</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="icon" className="rounded-full shadow-sm" disabled={loading}>
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Stock Summary */}
        <Card className="shadow-sm border-t-4 border-t-red-500 overflow-hidden relative group">
          <div className="absolute right-[-20px] top-[-20px] bg-red-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Total Units
              <Droplet className="w-4 h-4 ml-auto text-red-500 fill-red-500/20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {inventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0)} <span className="text-sm font-normal text-muted-foreground">units</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Stable</p>
          </CardContent>
        </Card>
        
        {/* Critical Shortages */}
        <Card className="shadow-sm border-t-4 border-t-amber-500 overflow-hidden relative group">
          <div className="absolute right-[-20px] top-[-20px] bg-amber-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Critical Shortages
              <Thermometer className="w-4 h-4 ml-auto text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-600">
              {inventory.filter(i => i.unitsAvailable < 5).length} <span className="text-sm font-normal text-muted-foreground line-clamp-1">blood groups</span>
            </div>
             <p className="text-xs text-muted-foreground mt-1 break-words line-clamp-1">
              {inventory.filter(i => i.unitsAvailable < 5).map(i => i.bloodGroup).join(", ") || "None"}
            </p>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="shadow-sm border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Pending Requests
              <List className="w-4 h-4 ml-auto text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-600">
              {requests.filter(r => r.status === "PENDING").length} 
            </div>
             <p className="text-xs text-muted-foreground mt-1 text-blue-800 line-clamp-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Inventory Table */}
        <Card className="md:col-span-1 shadow-md border-red-100 dark:border-red-900/50">
          <CardHeader className="bg-red-50/50 dark:bg-red-950/20 border-b">
            <CardTitle className="text-lg flex items-center"><Droplet className="w-5 h-5 mr-2 text-red-500" /> Current Inventory</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="grid grid-cols-2 divide-x divide-y">
                {bloodGroups.map((bg) => {
                  const data = inventory.find(i => i.bloodGroup === bg);
                  const units = data ? data.unitsAvailable : 0;
                  const isLow = units < 5;
                  
                  return (
                    <div key={bg} className={`p-4 flex flex-col items-center justify-center transition-colors ${isLow ? 'bg-red-50/50 hover:bg-red-50 dark:bg-red-950/20' : 'hover:bg-muted/50'}`}>
                      <span className="text-xl font-black text-red-700 dark:text-red-400">{bg}</span>
                      <span className={`text-2xl font-bold mt-1 ${isLow ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>{units}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">units</span>
                      {isLow && <span className="text-[10px] mt-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold animate-pulse">Low</span>}
                    </div>
                  );
                })}
             </div>
          </CardContent>
        </Card>

        {/* Requests Dashboard */}
        <Card className="md:col-span-2 shadow-md">
           <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Blood Requests List</CardTitle>
              <CardDescription>Manage incoming requests from patients and doctors.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {requests.length === 0 ? (
               <div className="p-12 text-center text-muted-foreground">
                  <List className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No active blood requests found.</p>
               </div>
            ) : (
              <div className="divide-y">
                {requests.map(req => (
                  <div key={req.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${req.urgencyLevel === 'CRITICAL' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                        {req.bloodGroup}
                      </div>
                      <div>
                        <p className="font-semibold">{req.unitsRequired} Units Required</p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                           <span className={`px-2 py-0.5.5 rounded-sm font-bold uppercase tracking-wider ${req.urgencyLevel === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' : req.urgencyLevel === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                             {req.urgencyLevel}
                           </span>
                           <span className="text-muted-foreground">ID: {req.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`px-3 py-1 rounded-full font-medium ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {req.status}
                      </span>
                      {req.status === "PENDING" && (
                        <Button onClick={() => handleApproveRequest(req.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
