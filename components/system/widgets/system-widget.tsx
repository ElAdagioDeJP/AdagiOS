"use client"

import { useState, useEffect } from "react"
import { Cpu, HardDrive, MemoryStickIcon as Memory, Activity } from "lucide-react"

interface SystemWidgetProps {
  className?: string
}

export default function SystemWidget({ className }: SystemWidgetProps) {
  const [cpuUsage, setCpuUsage] = useState(25)
  const [memoryUsage, setMemoryUsage] = useState(40)
  const [diskUsage, setDiskUsage] = useState(60)
  const [networkActivity, setNetworkActivity] = useState(15)

  // Simular cambios en el uso del sistema
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 60) + 10) // 10-70%
      setMemoryUsage(Math.floor(Math.random() * 40) + 30) // 30-70%
      setNetworkActivity(Math.floor(Math.random() * 30) + 5) // 5-35 MB/s
    }, 3000) // Actualizar cada 3 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`rounded-xl bg-black/30 p-4 backdrop-blur-lg ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Rendimiento del Sistema</h3>
        <span className="text-xs text-gray-300">En tiempo real</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-white">
              {/* CPU (rojo - rendimiento, potencia) */}
              <Cpu className="mr-2 h-4 w-4 text-red-400" />
              CPU
            </div>
            <span className="text-xs text-gray-300">{cpuUsage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-red-500"
              style={{ width: `${cpuUsage}%`, transition: "width 0.5s ease-in-out" }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-white">
              {/* Memoria (azul - estabilidad, confianza) */}
              <Memory className="mr-2 h-4 w-4 text-blue-400" />
              Memoria
            </div>
            <span className="text-xs text-gray-300">{memoryUsage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${memoryUsage}%`, transition: "width 0.5s ease-in-out" }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-white">
              {/* Disco (verde - crecimiento, almacenamiento) */}
              <HardDrive className="mr-2 h-4 w-4 text-emerald-400" />
              Disco
            </div>
            <span className="text-xs text-gray-300">{diskUsage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${diskUsage}%`, transition: "width 0.5s ease-in-out" }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-white">
              {/* Red (azul claro - comunicación, conexión) */}
              <Activity className="mr-2 h-4 w-4 text-cyan-400" />
              Red
            </div>
            <span className="text-xs text-gray-300">{networkActivity} MB/s</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-500"
              style={{ width: `${(networkActivity / 50) * 100}%`, transition: "width 0.5s ease-in-out" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
