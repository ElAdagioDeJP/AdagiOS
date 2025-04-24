"use client"

import { useState } from "react"
import {
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  X,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface ControlCenterProps {
  isOpen: boolean
  onClose: () => void
  batteryLevel: number
  isCharging: boolean
  isOnline: boolean
}

export default function ControlCenter({ isOpen, onClose, batteryLevel, isCharging, isOnline }: ControlCenterProps) {
  const [wifiEnabled, setWifiEnabled] = useState(isOnline)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [volumeLevel, setVolumeLevel] = useState(75)
  const [brightnessLevel, setBrightnessLevel] = useState(80)
  const [darkMode, setDarkMode] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-xl bg-black/40 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h2 className="text-lg font-semibold text-white">Centro de Control</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        {/* Controles principales */}
        <div className="mb-6 grid grid-cols-4 gap-2">
          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-colors ${
              wifiEnabled ? "bg-blue-600/80" : "bg-white/10"
            }`}
            onClick={() => setWifiEnabled(!wifiEnabled)}
          >
            {wifiEnabled ? (
              <Wifi className="mb-1 h-6 w-6 text-white" />
            ) : (
              <WifiOff className="mb-1 h-6 w-6 text-white" />
            )}
            <span className="text-xs text-white">Wi-Fi</span>
          </div>

          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-colors ${
              bluetoothEnabled ? "bg-blue-600/80" : "bg-white/10"
            }`}
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          >
            {bluetoothEnabled ? (
              <Bluetooth className="mb-1 h-6 w-6 text-white" />
            ) : (
              <BluetoothOff className="mb-1 h-6 w-6 text-white" />
            )}
            <span className="text-xs text-white">Bluetooth</span>
          </div>

          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-colors ${
              darkMode ? "bg-blue-800/80" : "bg-amber-400/80"
            }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Moon className="mb-1 h-6 w-6 text-white" /> : <Sun className="mb-1 h-6 w-6 text-white" />}
            <span className="text-xs text-white">{darkMode ? "Oscuro" : "Claro"}</span>
          </div>

          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-colors ${
              focusMode ? "bg-emerald-600/80" : "bg-white/10"
            }`}
            onClick={() => setFocusMode(!focusMode)}
          >
            {focusMode ? (
              <Minimize2 className="mb-1 h-6 w-6 text-white" />
            ) : (
              <Maximize2 className="mb-1 h-6 w-6 text-white" />
            )}
            <span className="text-xs text-white">Enfoque</span>
          </div>
        </div>

        {/* Controles de volumen y brillo */}
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {volumeLevel === 0 ? (
                  <VolumeX className="mr-2 h-5 w-5 text-white" />
                ) : (
                  <Volume2 className="mr-2 h-5 w-5 text-white" />
                )}
                <span className="text-sm text-white">Volumen</span>
              </div>
              <span className="text-xs text-white">{volumeLevel}%</span>
            </div>
            <Slider
              value={[volumeLevel]}
              max={100}
              step={1}
              onValueChange={(value) => setVolumeLevel(value[0])}
              className="h-1.5"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sun className="mr-2 h-5 w-5 text-white" />
                <span className="text-sm text-white">Brillo</span>
              </div>
              <span className="text-xs text-white">{brightnessLevel}%</span>
            </div>
            <Slider
              value={[brightnessLevel]}
              max={100}
              step={1}
              onValueChange={(value) => setBrightnessLevel(value[0])}
              className="h-1.5"
            />
          </div>
        </div>

        {/* Información del sistema */}
        <div className="rounded-xl bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Batería</span>
            <span className="text-sm text-white">
              {batteryLevel}% {isCharging && "- Cargando"}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${
                batteryLevel > 50 ? "bg-emerald-500" : batteryLevel > 20 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${batteryLevel}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10"
        >
          <Sliders className="mr-2 h-4 w-4" />
          Configuración del sistema
        </Button>
      </div>
    </div>
  )
}
