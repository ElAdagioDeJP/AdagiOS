"use client"

import { useState } from "react"
import { KeyRound, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginScreenProps {
  onLogin: () => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    setError("")

    // Simular verificación de credenciales
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        onLogin()
      } else {
        setError("Usuario o contraseña incorrectos")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>

      <div className="relative mb-8 flex flex-col items-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
          <KeyRound className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white">AdagiOS</h1>
        <p className="mt-2 text-lg text-purple-200">Sistema Operativo Avanzado</p>
      </div>

      <div className="relative w-96 overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 h-40 w-40 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 blur-3xl"></div>

        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-purple-500/20">
            <User className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-purple-700 bg-white/20 text-white placeholder:text-purple-200"
          />
        </div>

        <div className="mb-6">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-purple-700 bg-white/20 text-white placeholder:text-purple-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin()
              }
            }}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          <p className="mt-2 text-xs text-purple-200">Pista: Usuario y contraseña son "admin"</p>
        </div>

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </div>
    </div>
  )
}
