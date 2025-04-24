"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, Wind, Droplets, CloudSnow, CloudLightning } from "lucide-react"

interface WeatherWidgetProps {
  className?: string
}

export default function WeatherWidget({ className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState({
    temperature: 23,
    condition: "sunny",
    humidity: 45,
    windSpeed: 10,
    location: "Ciudad Virtual",
    forecast: [
      { day: "Lun", temp: 24, condition: "sunny" },
      { day: "Mar", temp: 22, condition: "cloudy" },
      { day: "Mié", temp: 19, condition: "rainy" },
      { day: "Jue", temp: 21, condition: "cloudy" },
      { day: "Vie", temp: 25, condition: "sunny" },
    ],
  })

  // Simular cambios en el clima
  useEffect(() => {
    const interval = setInterval(() => {
      const conditions = ["sunny", "cloudy", "rainy", "windy", "snowy", "stormy"]
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
      const randomTemp = Math.floor(Math.random() * 15) + 15 // 15-30°C
      const randomHumidity = Math.floor(Math.random() * 50) + 30 // 30-80%
      const randomWind = Math.floor(Math.random() * 20) + 5 // 5-25 km/h

      setWeather((prev) => ({
        ...prev,
        temperature: randomTemp,
        condition: randomCondition,
        humidity: randomHumidity,
        windSpeed: randomWind,
      }))
    }, 30000) // Cambiar cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-amber-400" /> // Amarillo - sol, calor
      case "cloudy":
        return <Cloud className="h-8 w-8 text-slate-400" /> // Gris - nubes
      case "rainy":
        return <CloudRain className="h-8 w-8 text-cyan-400" /> // Azul claro - lluvia
      case "windy":
        return <Wind className="h-8 w-8 text-blue-300" /> // Azul claro - viento
      case "snowy":
        return <CloudSnow className="h-8 w-8 text-slate-200" /> // Blanco - nieve
      case "stormy":
        return <CloudLightning className="h-8 w-8 text-indigo-400" /> // Púrpura - tormenta
      default:
        return <Sun className="h-8 w-8 text-amber-400" />
    }
  }

  const getSmallWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-4 w-4 text-amber-400" />
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-400" />
      case "rainy":
        return <CloudRain className="h-4 w-4 text-blue-400" />
      case "windy":
        return <Wind className="h-4 w-4 text-cyan-400" />
      case "snowy":
        return <CloudSnow className="h-4 w-4 text-blue-200" />
      case "stormy":
        return <CloudLightning className="h-4 w-4 text-purple-400" />
      default:
        return <Sun className="h-4 w-4 text-amber-400" />
    }
  }

  return (
    <div className={`rounded-xl bg-black/30 p-4 backdrop-blur-lg ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{weather.location}</h3>
        <span className="text-xs text-gray-300">Ahora</span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          {getWeatherIcon(weather.condition)}
          <span className="ml-2 text-3xl font-bold text-white">{weather.temperature}°C</span>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end text-sm text-gray-300">
            <Droplets className="mr-1 h-4 w-4" />
            {weather.humidity}%
          </div>
          <div className="flex items-center justify-end text-sm text-gray-300">
            <Wind className="mr-1 h-4 w-4" />
            {weather.windSpeed} km/h
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {weather.forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs text-gray-300">{day.day}</span>
            {getSmallWeatherIcon(day.condition)}
            <span className="mt-1 text-sm font-medium text-white">{day.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
