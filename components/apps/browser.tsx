"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WebPage {
  url: string
  title: string
  content: React.ReactNode
}

export default function Browser() {
  const [currentUrl, setCurrentUrl] = useState("https://adagios.local/inicio")
  const [history, setHistory] = useState<string[]>(["https://adagios.local/inicio"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const webPages: Record<string, WebPage> = {
    "https://adagios.local/inicio": {
      url: "https://adagios.local/inicio",
      title: "Navegador AdagiOS",
      content: (
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold text-blue-600">Bienvenido al Navegador AdagiOS</h1>
          <p className="mb-4 text-gray-700">Este es un navegador simulado dentro del sistema operativo AdagiOS.</p>

          <h2 className="mb-2 text-xl font-semibold text-blue-500">Enlaces Rápidos</h2>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>
              <a
                href="#"
                className="text-blue-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo("https://adagios.local/acerca-de")
                }}
              >
                Acerca de AdagiOS
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo("https://adagios.local/conceptos-so")
                }}
              >
                Conceptos de Sistemas Operativos
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo("https://adagios.local/ayuda")
                }}
              >
                Ayuda y Documentación
              </a>
            </li>
          </ul>

          <div className="rounded-lg bg-blue-50 p-4 shadow-md">
            <h3 className="mb-2 font-semibold text-blue-600">Buscar en la Web</h3>
            <div className="flex">
              <Input placeholder="Ingresa términos de búsqueda..." className="mr-2 border-blue-200" />
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                <Search className="mr-1 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    "https://adagios.local/acerca-de": {
      url: "https://adagios.local/acerca-de",
      title: "Acerca de AdagiOS",
      content: (
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold text-blue-600">Acerca de AdagiOS</h1>
          <p className="mb-4 text-gray-700">
            AdagiOS es un sistema operativo simulado diseñado para demostrar conceptos clave de sistemas operativos en
            un entorno basado en web.
          </p>

          <h2 className="mb-2 text-xl font-semibold text-blue-500">Características</h2>
          <ul className="mb-4 list-inside list-disc space-y-1 text-gray-700">
            <li>Gestión de Memoria</li>
            <li>Planificación de Procesos</li>
            <li>Gestión de Dispositivos de E/S</li>
            <li>Sistema de Archivos</li>
            <li>Prevención de Interbloqueos</li>
            <li>Exclusión Mutua</li>
          </ul>

          <p>
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("https://adagios.local/inicio")
              }}
            >
              Volver al Inicio
            </a>
          </p>
        </div>
      ),
    },
    "https://adagios.local/conceptos-so": {
      url: "https://adagios.local/conceptos-so",
      title: "Conceptos de SO - AdagiOS",
      content: (
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold text-blue-600">Conceptos de Sistemas Operativos</h1>

          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold text-blue-500">Gestión de Memoria</h2>
            <p className="text-gray-700">
              La gestión de memoria es responsable de asignar y liberar espacio de memoria según lo necesiten los
              programas. AdagiOS demuestra conceptos como paginación, segmentación y memoria virtual.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold text-blue-500">Gestión de Procesos</h2>
            <p className="text-gray-700">
              La gestión de procesos implica programar tiempo de CPU para diferentes procesos. AdagiOS implementa
              conceptos como planificación basada en quantum, planificación por prioridad y estados de procesos.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold text-blue-500">Interbloqueo y Inanición</h2>
            <p className="text-gray-700">
              El interbloqueo ocurre cuando los procesos no pueden continuar porque cada uno está esperando recursos que
              tiene otro. La inanición ocurre cuando a un proceso se le niegan indefinidamente los recursos necesarios.
              AdagiOS demuestra técnicas de prevención y detección.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold text-blue-500">Exclusión Mutua</h2>
            <p className="text-gray-700">
              La exclusión mutua asegura que solo un proceso pueda acceder a un recurso compartido a la vez. AdagiOS
              implementa semáforos, mutexes y monitores para demostrar este concepto.
            </p>
          </div>

          <p>
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("https://adagios.local/inicio")
              }}
            >
              Volver al Inicio
            </a>
          </p>
        </div>
      ),
    },
    "https://adagios.local/ayuda": {
      url: "https://adagios.local/ayuda",
      title: "Ayuda y Documentación - AdagiOS",
      content: (
        <div className="p-4">
          <h1 className="mb-4 text-2xl font-bold text-blue-600">Ayuda y Documentación</h1>

          <h2 className="mb-2 text-xl font-semibold text-blue-500">Usando AdagiOS</h2>
          <p className="mb-4 text-gray-700">
            AdagiOS es un sistema operativo simulado con una interfaz gráfica de usuario. Puedes interactuar con varias
            aplicaciones y herramientas del sistema para explorar conceptos de sistemas operativos.
          </p>

          <h2 className="mb-2 text-xl font-semibold text-blue-500">Aplicaciones</h2>
          <ul className="mb-4 list-inside list-disc space-y-1 text-gray-700">
            <li>
              <strong>Explorador de Archivos:</strong> Navega y gestiona archivos en el sistema de archivos simulado
            </li>
            <li>
              <strong>Bloc de Notas:</strong> Crea y edita documentos de texto
            </li>
            <li>
              <strong>Navegador:</strong> Simula navegación web dentro del SO
            </li>
            <li>
              <strong>Juego:</strong> Una aplicación simple de juego
            </li>
          </ul>

          <h2 className="mb-2 text-xl font-semibold text-blue-500">Herramientas del Sistema</h2>
          <ul className="mb-4 list-inside list-disc space-y-1 text-gray-700">
            <li>
              <strong>Administrador de Procesos:</strong> Ver y gestionar procesos en ejecución
            </li>
            <li>
              <strong>Administrador de Memoria:</strong> Monitorear asignación y uso de memoria
            </li>
            <li>
              <strong>Monitor del Sistema:</strong> Ver rendimiento general del sistema
            </li>
            <li>
              <strong>Administrador de Red:</strong> Gestionar conexiones de red
            </li>
          </ul>

          <p>
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("https://adagios.local/inicio")
              }}
            >
              Volver al Inicio
            </a>
          </p>
        </div>
      ),
    },
  }

  const navigateTo = (url: string) => {
    if (url === currentUrl) return

    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setCurrentUrl(url)

      // Update history
      if (historyIndex < history.length - 1) {
        // If we navigated back and then to a new page, truncate forward history
        setHistory([...history.slice(0, historyIndex + 1), url])
      } else {
        setHistory([...history, url])
      }
      setHistoryIndex(historyIndex + 1)

      setIsLoading(false)
    }, 500)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setIsLoading(true)

      // Simulate loading
      setTimeout(() => {
        setHistoryIndex(historyIndex - 1)
        setCurrentUrl(history[historyIndex - 1])
        setIsLoading(false)
      }, 300)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setIsLoading(true)

      // Simulate loading
      setTimeout(() => {
        setHistoryIndex(historyIndex + 1)
        setCurrentUrl(history[historyIndex + 1])
        setIsLoading(false)
      }, 300)
    }
  }

  const refresh = () => {
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If URL exists in our simulated web, navigate to it
    if (webPages[currentUrl]) {
      navigateTo(currentUrl)
    } else {
      // Simulate a 404 by navigating to home
      navigateTo("https://adagios.local/inicio")
    }
  }

  const currentPage = webPages[currentUrl] || webPages["https://adagios.local/inicio"]

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="mb-2 flex items-center space-x-2 bg-blue-50 p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="border-blue-200 text-blue-600 hover:bg-blue-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="border-blue-200 text-blue-600 hover:bg-blue-100"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          className="border-blue-200 text-blue-600 hover:bg-blue-100"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>

        <form className="flex-1" onSubmit={handleUrlSubmit}>
          <Input
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            className="border-blue-200 bg-white"
          />
        </form>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-auto rounded border border-blue-100 bg-white">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-400" />
              <p className="mt-2 text-sm text-gray-600">Cargando...</p>
            </div>
          </div>
        ) : (
          <div className="h-full">{currentPage.content}</div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-2 flex items-center justify-between rounded border border-blue-100 bg-blue-50 px-2 py-1 text-xs text-gray-600">
        <div>{currentPage.title}</div>
        <div>{isLoading ? "Cargando..." : "Listo"}</div>
      </div>
    </div>
  )
}
