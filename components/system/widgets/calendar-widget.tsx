"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"

interface CalendarWidgetProps {
  className?: string
}

export default function CalendarWidget({ className }: CalendarWidgetProps) {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Reunión de equipo",
      time: "10:00",
      duration: "1h",
    },
    {
      id: "2",
      title: "Almuerzo con clientes",
      time: "13:30",
      duration: "1.5h",
    },
    {
      id: "3",
      title: "Revisión de proyecto",
      time: "16:00",
      duration: "45m",
    },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getDayName = (day: number) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    return days[day]
  }

  const getMonthName = (month: number) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return months[month]
  }

  return (
    <div className={`rounded-xl bg-black/30 p-4 backdrop-blur-lg ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Calendario</h3>
        <div className="flex items-center text-xs text-gray-300">
          <Clock className="mr-1 h-3 w-3" />
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <div className="mr-4 flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-blue-600 text-white">
          <span className="text-xs font-medium">{getMonthName(date.getMonth()).substring(0, 3)}</span>
          <span className="text-xl font-bold">{date.getDate()}</span>
        </div>
        <div>
          <div className="text-lg font-semibold text-white">{getDayName(date.getDay())}</div>
          <div className="text-sm text-gray-300">
            {date.getDate()} de {getMonthName(date.getMonth())} de {date.getFullYear()}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="mb-2 text-xs font-medium uppercase text-gray-400">Eventos de hoy</h4>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="flex items-center rounded-lg bg-white/5 p-2">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600/30 text-cyan-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{event.title}</div>
                <div className="text-xs text-gray-400">
                  {event.time} • {event.duration}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-white/5 p-3 text-center text-sm text-gray-400">
            No hay eventos programados para hoy
          </div>
        )}
      </div>
    </div>
  )
}
