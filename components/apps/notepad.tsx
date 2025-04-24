"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Check, File, Folder, Save, Plus, Download, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SavedFile {
  id: string
  name: string
  content: string
  lastModified: Date
}

export default function Notepad() {
  const [content, setContent] = useState(
    "Bienvenido al Bloc de notas de AdagiOS!\n\nEste es un editor de texto simple para tus notas y documentos.",
  )
  const [fileName, setFileName] = useState("Sin título.txt")
  const [isSaved, setIsSaved] = useState(true)
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([])
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showOpenDialog, setShowOpenDialog] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [saveSuccess, setShowSaveSuccess] = useState(false)

  // Load saved files from localStorage on component mount
  useEffect(() => {
    const storedFiles = localStorage.getItem("adagios_notepad_files")
    if (storedFiles) {
      try {
        const parsedFiles = JSON.parse(storedFiles)
        // Convert string dates back to Date objects
        const filesWithDates = parsedFiles.map((file: any) => ({
          ...file,
          lastModified: new Date(file.lastModified),
        }))
        setSavedFiles(filesWithDates)
      } catch (error) {
        console.error("Error loading saved files:", error)
      }
    }
  }, [])

  // Save files to localStorage when they change
  useEffect(() => {
    if (savedFiles.length > 0) {
      localStorage.setItem("adagios_notepad_files", JSON.stringify(savedFiles))
    }
  }, [savedFiles])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsSaved(false)
  }

  const handleSave = () => {
    if (currentFileId) {
      // Update existing file
      setSavedFiles((prevFiles) =>
        prevFiles.map((file) => (file.id === currentFileId ? { ...file, content, lastModified: new Date() } : file)),
      )
      setIsSaved(true)
      setShowSaveSuccess(true)
      setTimeout(() => setShowSaveSuccess(false), 2000)
    } else {
      // Show save dialog for new file
      setNewFileName(fileName)
      setShowSaveDialog(true)
    }
  }

  const handleSaveAs = () => {
    setNewFileName(fileName)
    setShowSaveDialog(true)
  }

  const confirmSave = () => {
    const newFile: SavedFile = {
      id: currentFileId || Date.now().toString(),
      name: newFileName,
      content,
      lastModified: new Date(),
    }

    if (currentFileId) {
      // Update existing file with new name
      setSavedFiles((prevFiles) => prevFiles.map((file) => (file.id === currentFileId ? newFile : file)))
    } else {
      // Add new file
      setSavedFiles((prevFiles) => [...prevFiles, newFile])
      setCurrentFileId(newFile.id)
    }

    setFileName(newFileName)
    setIsSaved(true)
    setShowSaveDialog(false)
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 2000)
  }

  const handleOpen = () => {
    setShowOpenDialog(true)
  }

  const openFile = (fileId: string) => {
    const file = savedFiles.find((f) => f.id === fileId)
    if (file) {
      // Check if current file has unsaved changes
      if (!isSaved) {
        if (confirm("Tienes cambios sin guardar. ¿Deseas continuar sin guardar?")) {
          loadFile(file)
        }
      } else {
        loadFile(file)
      }
    }
    setShowOpenDialog(false)
  }

  const loadFile = (file: SavedFile) => {
    setContent(file.content)
    setFileName(file.name)
    setCurrentFileId(file.id)
    setIsSaved(true)
  }

  const createNewFile = () => {
    if (!isSaved) {
      if (confirm("Tienes cambios sin guardar. ¿Deseas continuar sin guardar?")) {
        resetEditor()
      }
    } else {
      resetEditor()
    }
  }

  const resetEditor = () => {
    setContent("")
    setFileName("Sin título.txt")
    setCurrentFileId(null)
    setIsSaved(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString()
  }

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 border-b border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-800">
        <Button variant="ghost" size="sm" onClick={createNewFile} className="rounded-lg">
          <Plus className="mr-1 h-4 w-4" />
          Nuevo
        </Button>
        <Button variant="ghost" size="sm" onClick={handleOpen} className="rounded-lg">
          <Folder className="mr-1 h-4 w-4" />
          Abrir
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSave} className="rounded-lg">
          <Save className="mr-1 h-4 w-4" />
          Guardar
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSaveAs} className="rounded-lg">
          <Download className="mr-1 h-4 w-4" />
          Guardar como
        </Button>

        <div className="ml-auto flex items-center">
          {!isSaved && <span className="mr-2 text-xs text-red-500">•</span>}
          <span className="text-sm text-gray-600 dark:text-gray-300">{fileName}</span>
        </div>

        {saveSuccess && (
          <div className="ml-2 flex items-center rounded-md bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/50 dark:text-green-300">
            <Check className="mr-1 h-3 w-3" />
            Guardado
          </div>
        )}
      </div>

      {/* Editor */}
      <Textarea
        className="flex-1 resize-none rounded-none border-0 border-gray-200 font-mono text-sm shadow-none focus-visible:ring-0 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        value={content}
        onChange={handleContentChange}
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
        <div className="flex items-center">
          <span className="mr-4">{content.length} caracteres</span>
          <span>{content.split("\n").length} líneas</span>
        </div>
        {currentFileId && (
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              Última modificación:{" "}
              {formatDate(savedFiles.find((f) => f.id === currentFileId)?.lastModified || new Date())}
            </span>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guardar archivo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="filename" className="text-sm font-medium">
                Nombre del archivo
              </label>
              <Input
                id="filename"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open Dialog */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Abrir archivo</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-auto">
            {savedFiles.length > 0 ? (
              <div className="space-y-2">
                {savedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    onClick={() => openFile(file.id)}
                  >
                    <div className="flex items-center">
                      <File className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(file.lastModified)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
                <Folder className="mb-2 h-10 w-10 opacity-50" />
                <p>No hay archivos guardados</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowOpenDialog(false)}>
                  Cerrar
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
