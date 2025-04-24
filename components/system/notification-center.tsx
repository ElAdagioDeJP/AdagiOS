"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, Info, AlertTriangle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  app: string
  timestamp: Date
  read: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [doNotDisturb, setDoNotDisturb] = useState(false)

  // Cargar notificaciones de ejemplo
  useEffect(() => {
    const exampleNotifications: Notification[] = [
      {
        id: "1",
        title: "Actualización del sistema",
        message: "Hay actualizaciones disponibles para AdagiOS.",
        type: "info",
        app: "Sistema",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
        read: false,
      },
      {
        id: "2",
        title: "Batería baja",
        message: "La batería está por debajo del 20%. Conecte el cargador.",
        type: "warning",
        app: "Sistema",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
        read: true,
      },
      {
        id: "3",
        title: "Nuevo correo",
        message: "Has recibido un nuevo correo de usuario@ejemplo.com",
        type: "info",
        app: "Correo",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
        read: false,
      },
      {
        id: "4",
        title: "Recordatorio",
        message: "Reunión con el equipo a las 15:00",
        type: "info",
        app: "Calendario",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
        read: false,
      },
      {
        id: "5",
        title: "Error de conexión",
        message: "No se pudo conectar al servidor. Verifique su conexión a internet.",
        type: "error",
        app: "Navegador",
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 horas atrás
        read: true,
      },
      {
        id: "6",
        title: "Archivo guardado",
        message: "El documento 'Informe.txt' se ha guardado correctamente.",
        type: "success",
        app: "Bloc de notas",
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 horas atrás
        read: true,
      },
    ]

    setNotifications(exampleNotifications)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" /> // Azul - información, confianza
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" /> // Ámbar - precaución, atención
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" /> // Rojo - error, peligro
      case "success":
        return <Check className="h-5 w-5 text-emerald-500" /> // Verde esmeralda - éxito, completado
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "Ahora mismo"
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} h`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-xl bg-black/40 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h2 className="text-lg font-semibold text-white">Notificaciones</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="border-b border-white/10 px-4">
          <TabsList className="grid w-full grid-cols-2 bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
              Todas
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-white/10">
              No leídas {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="p-0">
          <ScrollArea className="h-[400px]">
            {notifications.length > 0 ? (
              <div className="space-y-1 p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative rounded-lg p-3 transition-colors hover:bg-white/5 ${
                      notification.read ? "opacity-70" : "bg-white/5"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white">{notification.title}</p>
                          <span className="text-xs text-gray-400">{formatTime(notification.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-300">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-400">{notification.app}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <Bell className="mb-2 h-10 w-10 text-gray-500" />
                <p className="text-gray-400">No hay notificaciones</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="p-0">
          <ScrollArea className="h-[400px]">
            {notifications.filter((n) => !n.read).length > 0 ? (
              <div className="space-y-1 p-2">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="relative rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">{notification.title}</p>
                            <span className="text-xs text-gray-400">{formatTime(notification.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-300">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-400">{notification.app}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <Check className="mb-2 h-10 w-10 text-gray-500" />
                <p className="text-gray-400">No hay notificaciones sin leer</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="dnd-mode"
              checked={doNotDisturb}
              onCheckedChange={setDoNotDisturb}
              className="data-[state=checked]:bg-blue-600" // Cambiar a azul para coherencia
            />
            <label htmlFor="dnd-mode" className="text-sm text-white">
              No molestar
            </label>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-white" onClick={clearAll}>
            Limpiar todo
          </Button>
        </div>
      </div>
    </div>
  )
}
