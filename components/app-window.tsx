"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Maximize2, Minimize2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { AppType } from "./desktop"

interface AppWindowProps {
  app: AppType
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  onPositionChange: (position: { x: number; y: number }) => void
  onSizeChange: (size: { width: number; height: number }) => void
}

export default function AppWindow({
  app,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onPositionChange,
  onSizeChange,
}: AppWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position: { x: 0, y: 0 }, size: { width: 0, height: 0 } })
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        onPositionChange({ x: newX, y: newY })
      } else if (isResizing) {
        const newWidth = resizeStart.width + (e.clientX - resizeStart.x)
        const newHeight = resizeStart.height + (e.clientY - resizeStart.y)
        onSizeChange({
          width: Math.max(300, newWidth),
          height: Math.max(200, newHeight),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, onPositionChange, onSizeChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMaximized) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - app.position.x,
        y: e.clientY - app.position.y,
      })
    }
    onFocus()
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isMaximized) {
      setIsResizing(true)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: app.size.width,
        height: app.size.height,
      })
    }
    onFocus()
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous size and position
      onPositionChange(preMaximizeState.position)
      onSizeChange(preMaximizeState.size)
    } else {
      // Save current size and position
      setPreMaximizeState({
        position: { ...app.position },
        size: { ...app.size },
      })
      // Maximize
      onPositionChange({ x: 0, y: 0 })
      onSizeChange({
        width: window.innerWidth,
        height: window.innerHeight - 48, // Subtract taskbar height
      })
    }
    setIsMaximized(!isMaximized)
  }

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute overflow-hidden rounded-xl border shadow-2xl backdrop-blur-lg transition-shadow duration-300",
        isActive
          ? `border-[${app.color.split(" ")[1]}] shadow-[${app.color.split(" ")[1]}]/20`
          : "border-gray-700/50 shadow-black/20",
        isMaximized ? "rounded-none" : "",
      )}
      style={{
        left: `${app.position.x}px`,
        top: `${app.position.y}px`,
        width: `${app.size.width}px`,
        height: `${app.size.height}px`,
        zIndex: app.zIndex,
      }}
      onClick={onFocus}
    >
      {/* Title Bar - Modern glass morphism style */}
      <div
        className={cn(
          "flex h-10 items-center justify-between px-4",
          isActive ? `bg-gradient-to-r ${app.color} text-white` : "bg-gray-800/70 text-gray-300",
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center">
          <div className="mr-3 flex h-6 w-6 items-center justify-center">{app.icon}</div>
          <div className="text-sm font-medium">{app.title}</div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20"
            onClick={onMinimize}
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20"
            onClick={toggleMaximize}
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-white/10 hover:bg-red-500/80"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-40px)] overflow-auto bg-gray-100 dark:bg-gray-900">{app.component}</div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  )
}
