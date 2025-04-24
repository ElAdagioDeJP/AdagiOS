"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Activity,
  BarChart3,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Bell,
  CalculatorIcon,
  Calendar,
  Clock,
  Database,
  FileText,
  Gamepad2,
  Globe,
  HardDrive,
  ImageIcon,
  LogOut,
  Mail,
  Moon,
  Network,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Settings,
  Sliders,
  Sparkles,
  User,
  Wifi,
  WifiOff,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import AppWindow from "./app-window"
import FileManager from "./apps/file-manager"
import Notepad from "./apps/notepad"
import Browser from "./apps/browser"
import Game from "./apps/game"
import Calculator from "./apps/calculator"
import ProcessManager from "./system/process-manager"
import MemoryManager from "./system/memory-manager"
import SystemMonitor from "./system/system-monitor"
import NetworkManager from "./system/network-manager"
import NotificationCenter from "./system/notification-center"
import ControlCenter from "./system/control-center"
import VirtualAssistant from "./system/virtual-assistant"
import WidgetManager from "./system/widget-manager"
import LoginScreen from "./login-screen"

export type AppType = {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  color: string
}

export default function Desktop() {
  const [apps, setApps] = useState<AppType[]>([])
  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [time, setTime] = useState(new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState(75)
  const [isCharging, setIsCharging] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false)
  const [isDockExpanded, setIsDockExpanded] = useState(false)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false)
  const [isVirtualAssistantOpen, setIsVirtualAssistantOpen] = useState(false)
  const [showWidgets, setShowWidgets] = useState(true)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  // Initialize apps with distinctive icons and colors
  useEffect(() => {
    setApps([
      {
        id: "file-manager",
        title: "Explorador de Archivos",
        icon: <HardDrive className="h-6 w-6" />,
        component: <FileManager />,
        position: { x: 50, y: 50 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-blue-600 to-blue-700",
      },
      {
        id: "notepad",
        title: "Bloc de Notas",
        icon: <FileText className="h-6 w-6" />,
        component: <Notepad />,
        position: { x: 100, y: 100 },
        size: { width: 500, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-amber-400 to-amber-500",
      },
      {
        id: "browser",
        title: "Navegador Web",
        icon: <Globe className="h-6 w-6" />,
        component: <Browser />,
        position: { x: 150, y: 150 },
        size: { width: 700, height: 500 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-sky-400 to-sky-500",
      },
      {
        id: "game",
        title: "Juegos",
        icon: <Gamepad2 className="h-6 w-6" />,
        component: <Game />,
        position: { x: 200, y: 200 },
        size: { width: 500, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-emerald-500 to-emerald-600",
      },
      {
        id: "calculator",
        title: "Calculadora",
        icon: <CalculatorIcon className="h-6 w-6" />,
        component: <Calculator />,
        position: { x: 250, y: 250 },
        size: { width: 300, height: 450 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-gray-600 to-gray-700",
      },
      {
        id: "process-manager",
        title: "Administrador de Tareas",
        icon: <Activity className="h-6 w-6" />,
        component: <ProcessManager />,
        position: { x: 300, y: 300 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-red-600 to-red-700",
      },
      {
        id: "memory-manager",
        title: "Administrador de Memoria",
        icon: <Database className="h-6 w-6" />,
        component: <MemoryManager />,
        position: { x: 350, y: 350 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-purple-600 to-purple-700",
      },
      {
        id: "system-monitor",
        title: "Monitor del Sistema",
        icon: <BarChart3 className="h-6 w-6" />,
        component: <SystemMonitor />,
        position: { x: 400, y: 400 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-blue-800 to-blue-900",
      },
      {
        id: "network-manager",
        title: "Administrador de Red",
        icon: <Network className="h-6 w-6" />,
        component: <NetworkManager />,
        position: { x: 450, y: 450 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-teal-600 to-teal-700",
      },
      {
        id: "settings",
        title: "Configuración",
        icon: <Settings className="h-6 w-6" />,
        component: <div className="p-4">Configuración del sistema</div>,
        position: { x: 500, y: 500 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-slate-600 to-slate-700",
      },
      {
        id: "calendar",
        title: "Calendario",
        icon: <Calendar className="h-6 w-6" />,
        component: <div className="p-4">Aplicación de calendario</div>,
        position: { x: 550, y: 550 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-cyan-500 to-cyan-600",
      },
      {
        id: "mail",
        title: "Correo",
        icon: <Mail className="h-6 w-6" />,
        component: <div className="p-4">Cliente de correo electrónico</div>,
        position: { x: 600, y: 600 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-blue-500 to-blue-600",
      },
      {
        id: "photos",
        title: "Fotos",
        icon: <ImageIcon className="h-6 w-6" />,
        component: <div className="p-4">Galería de fotos</div>,
        position: { x: 650, y: 650 },
        size: { width: 600, height: 400 },
        isOpen: false,
        isMinimized: false,
        zIndex: 0,
        color: "from-orange-500 to-orange-600",
      },
    ])
  }, [])

  // Update clock and simulate battery/network changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())

      // Simulate battery changes
      if (Math.random() < 0.1) {
        if (isCharging) {
          setBatteryLevel((prev) => Math.min(100, prev + 1))
          if (batteryLevel >= 100 && Math.random() < 0.3) {
            setIsCharging(false)
          }
        } else {
          setBatteryLevel((prev) => Math.max(1, prev - 1))
          if (batteryLevel <= 20 && Math.random() < 0.3) {
            setIsCharging(true)
          }
        }
      }

      // Simulate network changes
      if (Math.random() < 0.05) {
        setIsOnline((prev) => !prev)
      }

      // Simulate new notifications
      if (Math.random() < 0.1) {
        setUnreadNotifications((prev) => prev + 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [batteryLevel, isCharging])

  const openApp = (id: string) => {
    setApps((prevApps) => {
      const maxZIndex = Math.max(...prevApps.map((app) => app.zIndex), 0)
      return prevApps.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            isOpen: true,
            isMinimized: false,
            zIndex: maxZIndex + 1,
          }
        }
        return app
      })
    })
    setActiveAppId(id)
    setIsStartMenuOpen(false)
  }

  const closeApp = (id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === id) {
          return { ...app, isOpen: false }
        }
        return app
      }),
    )
    setActiveAppId(null)
  }

  const minimizeApp = (id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === id) {
          return { ...app, isMinimized: true }
        }
        return app
      }),
    )
    setActiveAppId(null)
  }

  const bringToFront = (id: string) => {
    setApps((prevApps) => {
      const maxZIndex = Math.max(...prevApps.map((app) => app.zIndex), 0)
      return prevApps.map((app) => {
        if (app.id === id) {
          return { ...app, zIndex: maxZIndex + 1, isMinimized: false }
        }
        return app
      })
    })
    setActiveAppId(id)
  }

  const updatePosition = (id: string, position: { x: number; y: number }) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === id) {
          return { ...app, position }
        }
        return app
      }),
    )
  }

  const updateSize = (id: string, size: { width: number; height: number }) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === id) {
          return { ...app, size }
        }
        return app
      }),
    )
  }

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen)
    setIsPowerMenuOpen(false)
    setIsNotificationCenterOpen(false)
    setIsControlCenterOpen(false)
  }

  const togglePowerMenu = () => {
    setIsPowerMenuOpen(!isPowerMenuOpen)
    setIsStartMenuOpen(false)
    setIsNotificationCenterOpen(false)
    setIsControlCenterOpen(false)
  }

  const toggleNotificationCenter = () => {
    setIsNotificationCenterOpen(!isNotificationCenterOpen)
    setIsStartMenuOpen(false)
    setIsPowerMenuOpen(false)
    setIsControlCenterOpen(false)
    if (!isNotificationCenterOpen) {
      setUnreadNotifications(0)
    }
  }

  const toggleControlCenter = () => {
    setIsControlCenterOpen(!isControlCenterOpen)
    setIsStartMenuOpen(false)
    setIsPowerMenuOpen(false)
    setIsNotificationCenterOpen(false)
  }

  const toggleVirtualAssistant = () => {
    setIsVirtualAssistantOpen(!isVirtualAssistantOpen)
  }

  const toggleWidgets = () => {
    setShowWidgets(!showWidgets)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setApps((prevApps) =>
      prevApps.map((app) => ({
        ...app,
        isOpen: false,
        isMinimized: false,
      })),
    )
    setIsStartMenuOpen(false)
    setIsPowerMenuOpen(false)
  }

  const handleShutdown = () => {
    // Simulate shutdown
    document.body.style.opacity = "0"
    setTimeout(() => {
      document.body.style.opacity = "1"
      setIsLoggedIn(false)
      setApps((prevApps) =>
        prevApps.map((app) => ({
          ...app,
          isOpen: false,
          isMinimized: false,
        })),
      )
    }, 2000)
    setIsPowerMenuOpen(false)
  }

  const handleRestart = () => {
    // Simulate restart
    document.body.style.opacity = "0"
    setTimeout(() => {
      document.body.style.opacity = "1"
      setIsLoggedIn(false)
      setApps((prevApps) =>
        prevApps.map((app) => ({
          ...app,
          isOpen: false,
          isMinimized: false,
        })),
      )
      setTimeout(() => {
        setIsLoggedIn(true)
      }, 1000)
    }, 2000)
    setIsPowerMenuOpen(false)
  }

  const handleSleep = () => {
    // Simulate sleep
    document.body.style.opacity = "0"
    setTimeout(() => {
      document.body.style.opacity = "1"
    }, 3000)
    setIsPowerMenuOpen(false)
  }

  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="h-5 w-5" />
    if (batteryLevel > 80) return <BatteryFull className="h-5 w-5" />
    if (batteryLevel > 50) return <BatteryMedium className="h-5 w-5" />
    if (batteryLevel > 20) return <Battery className="h-5 w-5" />
    if (batteryLevel > 10) return <BatteryLow className="h-5 w-5 text-yellow-500" />
    return <BatteryWarning className="h-5 w-5 text-red-500" />
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Desktop Background - Modern gradient with particles effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-800 to-blue-900">
        {/* Optional: Add a background image */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>

        {/* Animated particles/circles for modern look */}
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-pink-500 opacity-10 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="absolute right-1/3 top-1/3 h-48 w-48 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
      </div>

      {/* Widgets Layer */}
      {showWidgets && <WidgetManager />}

      {/* Desktop Icons - Grid layout with modern app icons */}
      <div className="grid grid-cols-4 gap-6 p-8 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {apps.map((app) => (
          <div
            key={app.id}
            className="group flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200 hover:bg-white/10 hover:backdrop-blur-sm"
            onDoubleClick={() => openApp(app.id)}
          >
            <div
              className={`mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${app.color} shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:shadow-xl`}
            >
              {app.icon}
            </div>
            <span className="text-center text-sm font-medium text-white">{app.title}</span>
          </div>
        ))}
      </div>

      {/* App Windows */}
      {apps
        .filter((app) => app.isOpen && !app.isMinimized)
        .map((app) => (
          <AppWindow
            key={app.id}
            app={app}
            isActive={activeAppId === app.id}
            onClose={() => closeApp(app.id)}
            onMinimize={() => minimizeApp(app.id)}
            onFocus={() => bringToFront(app.id)}
            onPositionChange={(position) => updatePosition(app.id, position)}
            onSizeChange={(size) => updateSize(app.id, size)}
          />
        ))}

      {/* Modern Dock - macOS inspired */}
      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-end space-x-1 rounded-2xl bg-white/10 p-2 backdrop-blur-md transition-all duration-300 hover:bg-white/20"
        onMouseEnter={() => setIsDockExpanded(true)}
        onMouseLeave={() => setIsDockExpanded(false)}
      >
        {apps.slice(0, 8).map((app) => (
          <TooltipProvider key={app.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    `flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-gradient-to-br ${app.color} p-0 transition-all duration-200`,
                    isDockExpanded && "h-14 w-14",
                    app.isOpen && "ring-2 ring-white/50",
                    activeAppId === app.id && "ring-2 ring-white",
                  )}
                  onClick={() => {
                    if (app.isOpen) {
                      if (app.isMinimized || activeAppId !== app.id) {
                        bringToFront(app.id)
                      } else {
                        minimizeApp(app.id)
                      }
                    } else {
                      openApp(app.id)
                    }
                  }}
                >
                  {app.icon}
                  {app.isOpen && <div className="absolute bottom-1 h-1 w-1 rounded-full bg-white"></div>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{app.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Top Bar - macOS inspired */}
      <div className="absolute top-0 left-0 right-0 flex h-10 items-center justify-between bg-black/20 px-4 backdrop-blur-md">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            onClick={toggleStartMenu}
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <div className="ml-4 text-sm font-medium text-white">
            {activeAppId ? apps.find((app) => app.id === activeAppId)?.title : "AdagiOS"}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-white">
          {/* Virtual Assistant Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                  onClick={toggleVirtualAssistant}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Asistente Virtual</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Widgets Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full text-white hover:bg-white/10 ${showWidgets ? "bg-white/10" : ""}`}
                  onClick={toggleWidgets}
                >
                  <Sliders className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showWidgets ? "Ocultar Widgets" : "Mostrar Widgets"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Network Status */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                  onClick={toggleControlCenter}
                >
                  {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4 text-red-400" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isOnline ? "Conectado a Internet" : "Sin conexión"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Battery Status */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                  onClick={toggleControlCenter}
                >
                  {getBatteryIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {batteryLevel}% {isCharging ? "- Cargando" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notification Center */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full text-white hover:bg-white/10"
                  onClick={toggleNotificationCenter}
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notificaciones</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Time and Date */}
          <div className="flex items-center rounded-full bg-white/10 px-3 py-1 text-sm">
            <Clock className="mr-2 h-4 w-4" />
            {time.toLocaleTimeString()}
          </div>

          {/* Power Button */}
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                    onClick={togglePowerMenu}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Opciones de energía</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isPowerMenuOpen && (
              <div className="absolute right-0 top-10 w-48 rounded-xl bg-black/50 shadow-lg backdrop-blur-md">
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="flex w-full justify-start rounded-lg text-white hover:bg-white/10"
                    onClick={handleSleep}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Suspender
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-start rounded-lg text-white hover:bg-white/10"
                    onClick={handleRestart}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reiniciar
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-start rounded-lg text-white hover:bg-white/10"
                    onClick={handleShutdown}
                  >
                    <PowerOff className="mr-2 h-4 w-4" />
                    Apagar
                  </Button>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    className="flex w-full justify-start rounded-lg text-white hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Menu - Modern design */}
      {isStartMenuOpen && (
        <div className="absolute top-12 left-4 w-96 overflow-hidden rounded-2xl bg-black/40 shadow-xl backdrop-blur-xl">
          <div className="p-6">
            <div className="mb-6 flex items-center">
              <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Admin</div>
                <div className="text-sm text-gray-300">Administrador</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar aplicaciones..."
                  className="border-0 bg-white/10 pl-10 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="mb-2 text-xs font-medium text-gray-400">APLICACIONES RECIENTES</div>
              <div className="grid grid-cols-4 gap-2">
                {apps.slice(0, 8).map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    className="flex h-auto flex-col items-center justify-center rounded-xl p-2 text-white hover:bg-white/10"
                    onClick={() => openApp(app.id)}
                  >
                    <div
                      className={`mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${app.color}`}
                    >
                      {app.icon}
                    </div>
                    <div className="text-center text-xs">{app.title.split(" ")[0]}</div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-xs font-medium text-gray-400">TODAS LAS APLICACIONES</div>
              <div className="grid grid-cols-1 gap-1">
                {apps.map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    className="flex w-full justify-start rounded-lg text-white hover:bg-white/10"
                    onClick={() => openApp(app.id)}
                  >
                    <div
                      className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${app.color}`}
                    >
                      {app.icon}
                    </div>
                    {app.title}
                  </Button>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator className="bg-white/20" />

            <div className="grid grid-cols-1 gap-1">
              <Button
                variant="ghost"
                className="flex w-full justify-start rounded-lg text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Cerrar sesión
              </Button>
              <Button
                variant="ghost"
                className="flex w-full justify-start rounded-lg text-white hover:bg-white/10"
                onClick={handleShutdown}
              >
                <PowerOff className="mr-2 h-5 w-5" />
                Apagar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Center */}
      <NotificationCenter isOpen={isNotificationCenterOpen} onClose={() => setIsNotificationCenterOpen(false)} />

      {/* Control Center */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        batteryLevel={batteryLevel}
        isCharging={isCharging}
        isOnline={isOnline}
      />

      {/* Virtual Assistant */}
      <VirtualAssistant isOpen={isVirtualAssistantOpen} onClose={() => setIsVirtualAssistantOpen(false)} />
    </div>
  )
}
