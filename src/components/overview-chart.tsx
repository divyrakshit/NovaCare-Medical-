"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Jan",
    Cardiology: Math.floor(Math.random() * 50) + 10,
    Neurology: Math.floor(Math.random() * 30) + 5,
    Pediatrics: Math.floor(Math.random() * 60) + 20,
  },
  {
    name: "Feb",
    Cardiology: Math.floor(Math.random() * 50) + 10,
    Neurology: Math.floor(Math.random() * 30) + 5,
    Pediatrics: Math.floor(Math.random() * 60) + 20,
  },
  {
    name: "Mar",
    Cardiology: Math.floor(Math.random() * 50) + 10,
    Neurology: Math.floor(Math.random() * 30) + 5,
    Pediatrics: Math.floor(Math.random() * 60) + 20,
  },
  {
    name: "Apr",
    Cardiology: Math.floor(Math.random() * 50) + 10,
    Neurology: Math.floor(Math.random() * 30) + 5,
    Pediatrics: Math.floor(Math.random() * 60) + 20,
  },
  {
    name: "May",
    Cardiology: Math.floor(Math.random() * 50) + 10,
    Neurology: Math.floor(Math.random() * 30) + 5,
    Pediatrics: Math.floor(Math.random() * 60) + 20,
  },
  {
    name: "Jun",
    Cardiology: Math.floor(Math.random() * 50) + 10,
    Neurology: Math.floor(Math.random() * 30) + 5,
    Pediatrics: Math.floor(Math.random() * 60) + 20,
  },
]

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
        />
        <Legend />
        <Bar dataKey="Cardiology" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Neurology" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Pediatrics" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
