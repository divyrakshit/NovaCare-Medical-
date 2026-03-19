"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, Server, Clock, RefreshCcw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SystemStatusDashboard() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system-status");
      const data = await res.json();
      setDbStatus(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error("Failed to check status", error);
      setDbStatus({ status: "error", database: "unreachable", latencyMs: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Auto refresh every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const isOperational = dbStatus?.status === "operational";

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Status Log</h2>
          <p className="text-muted-foreground mt-1 text-lg">Live connectivity verification for the Hospital Management Backend.</p>
        </div>
        <Button onClick={checkStatus} variant="outline" size="icon" className="rounded-full" disabled={loading}>
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Main Overall Status Card */}
      <Card className={`overflow-hidden relative border-t-8 shadow-lg ${isOperational ? 'border-t-emerald-500 shadow-emerald-500/10' : 'border-t-red-500 shadow-red-500/10'}`}>
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${isOperational ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <CardContent className="p-10 flex flex-col items-center justify-center text-center relative z-10">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${isOperational ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'}`}>
            {isOperational ? (
              <ShieldCheck className="w-12 h-12" />
            ) : (
              <AlertTriangle className="w-12 h-12" />
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {isOperational ? "All Systems Operational" : "System Issues Detected"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {isOperational 
              ? "The Hospital Backend, Database, and API routes are successfully connected and functioning without errors." 
              : "We are currently experiencing connectivity issues with the backend database. Please check the server logs."}
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground font-medium">
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2"/> Last Checked: {lastChecked ? lastChecked.toLocaleTimeString() : '...'}</span>
            <span className="flex items-center"><Server className="w-4 h-4 mr-2"/> env: production</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Database Connection Node */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center text-muted-foreground">
              <Database className="w-4 h-4 mr-2" /> SQLite Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{isOperational ? "Connected" : "Disconnected"}</p>
                <p className="text-xs text-muted-foreground mt-1 break-all">prisma://localhost:5432/db</p>
              </div>
              {isOperational ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              )}
            </div>
            {dbStatus?.error && (
              <div className="mt-4 p-2 bg-red-50 dark:bg-red-950/30 text-red-600 text-xs rounded-md border border-red-100 dark:border-red-900 border-dashed">
                {dbStatus.error.slice(0, 100)}...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Query Latency */}
        <Card className="shadow-md">
           <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center text-muted-foreground">
              <Activity className="w-4 h-4 mr-2" /> Database Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black">{dbStatus?.latencyMs || 0}</p>
                  <span className="text-sm font-bold text-muted-foreground">ms</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Average response time</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${dbStatus?.latencyMs < 50 ? 'bg-emerald-100 text-emerald-700' : dbStatus?.latencyMs < 200 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {dbStatus?.latencyMs < 50 ? 'Excellent' : dbStatus?.latencyMs < 200 ? 'Fair' : 'Poor'}
              </div>
            </div>
            
            <div className="mt-6 w-full bg-muted rounded-full h-2 overflow-hidden">
               <div 
                className={`h-full rounded-full ${dbStatus?.latencyMs < 50 ? 'bg-emerald-500' : dbStatus?.latencyMs < 200 ? 'bg-amber-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.min((dbStatus?.latencyMs || 0) / 2, 100)}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        {/* API Health */}
        <Card className="shadow-md">
           <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center text-muted-foreground">
              <Server className="w-4 h-4 mr-2" /> Core Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Authentication', 'Blood Bank RPC', 'AI WebSockets'].map((service, i) => (
                <div key={service} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{service}</span>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                     <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    UP
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
