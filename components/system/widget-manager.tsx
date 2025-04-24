"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import WeatherWidget from "./widgets/weather-widget"
import CalendarWidget from "./widgets/calendar-widget"
import SystemWidget from "./widgets/system-widget"

interface WidgetPosition {
  x: number
  y: number
}

interface Widget {
  id: string
  type: "weather" | "calendar" | "system"
  position: WidgetPosition
  isVisible: boolean
}

export default function WidgetManager() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "weather-1", type: "weather", position: { x: 20, y: 20 }, isVisible: true },
    { id: "calendar-1", type: "calendar", position: { x: 20, y: 250 }, isVisible: true },
    { id: "system-1", type: "system", position: { x: 300, y: 20 }, isVisible: true },
  ])
  const [activeWidget, setActiveWidget] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)

  const handleMouseDown = (e: React.MouseEvent, widgetId: string) => {
    setActiveWidget(widgetId)
    setIsDragging(true)

    const widget = widgets.find((w) => w.id === widgetId)
    if (widget) {
      setDragOffset({
        x: e.clientX - widget.position.x,
        y: e.clientY - widget.position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && activeWidget) {
      const newWidgets = widgets.map((widget) => {
        if (widget.id === activeWidget) {
          return {
            ...widget,
            position: {
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y,
            },
          }
        }
        return widget
      })
      setWidgets(newWidgets)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const removeWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId))
  }

  const addWidget = (type: "weather" | "calendar" | "system") => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 50, y: 50 },
      isVisible: true,
    }
    setWidgets((prev) => [...prev, newWidget])
    setIsAddMenuOpen(false)
  }

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "weather":
        return <WeatherWidget className="w-64" />
      case "calendar":
        return <CalendarWidget className="w-64" />
      case "system":
        return <SystemWidget className="w-64" />
      default:
        return null
    }
  }

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="absolute cursor-move"
          style={{
            left: `${widget.position.x}px`,
            top: `${widget.position.y}px`,
            zIndex: activeWidget === widget.id ? 10 : 1,
          }}
        >
          <div className="group relative">
            <div
              className="absolute -right-2 -top-2 hidden rounded-full bg-black/50 p-1 group-hover:block"
              onClick={() => removeWidget(widget.id)}
            >
              <X className="h-3 w-3 text-white" />
            </div>
            <div
              className="absolute -left-2 -top-2 hidden rounded-full bg-black/50 p-1 group-hover:block"
              onMouseDown={(e) => handleMouseDown(e, widget.id)}
            >
              <Move className="h-3 w-3 text-white" />
            </div>
            {renderWidget(widget)}
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700"
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          >
            <Plus className="h-6 w-6" />
          </Button>

          {isAddMenuOpen && (
            <div className="absolute bottom-14 right-0 rounded-lg bg-black/40 p-2 backdrop-blur-lg">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="flex w-full justify-start text-white hover:bg-white/10"
                  onClick={() => addWidget("weather")}
                >
                  Clima
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start text-white hover:bg-white/10"
                  onClick={() => addWidget("calendar")}
                >
                  Calendario
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start text-white hover:bg-white/10"
                  onClick={() => addWidget("system")}
                >
                  Sistema
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
