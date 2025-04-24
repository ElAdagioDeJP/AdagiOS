"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, X, Send, Sparkles, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

interface VirtualAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export default function VirtualAssistant({ isOpen, onClose }: VirtualAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hola, soy Ada, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simular respuesta del asistente después de un breve retraso
    setTimeout(() => {
      const responses = [
        "Estoy procesando tu solicitud.",
        "Déjame buscar esa información para ti.",
        "Puedo ayudarte con eso. Aquí tienes la información que necesitas.",
        "No estoy seguro de entender. ¿Podrías reformular tu pregunta?",
        "Esa es una buena pregunta. La respuesta es...",
        "Estoy aquí para ayudarte con cualquier tarea que necesites.",
        "Voy a necesitar más detalles para poder ayudarte mejor.",
        "He encontrado varias opciones que podrían interesarte.",
      ]

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)
    }, 1500)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simular reconocimiento de voz después de un breve retraso
      setTimeout(() => {
        setInput("¿Cuál es el clima para hoy?")
        setIsListening(false)
      }, 2000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-4 bottom-20 z-50 w-96 overflow-hidden rounded-xl bg-black/40 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">Ada - Asistente Virtual</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-96 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === "user"
                    ? "rounded-tr-none bg-blue-600 text-white"
                    : "rounded-tl-none bg-white/10 text-white"
                }`}
              >
                <div className="mb-1 flex items-center">
                  {message.sender === "assistant" ? (
                    <Bot className="mr-1 h-3 w-3 text-indigo-300" />
                  ) : (
                    <User className="mr-1 h-3 w-3 text-purple-300" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.sender === "assistant" ? "Ada" : "Tú"} • {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-white/10 px-4 py-2 text-white">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-300"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-300"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-300"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 rounded-full ${
              isListening ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
            onClick={toggleListening}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="border-0 bg-white/10 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
