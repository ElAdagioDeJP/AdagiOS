"use client"

import { useState } from "react"
import { File, Folder, FolderOpen, HardDrive, RefreshCw, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileSystemItem {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileSystemItem[]
  size: number
  createdAt: Date
  modifiedAt: Date
}

export default function FileManager() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      id: "root",
      name: "Root",
      type: "folder",
      size: 0,
      createdAt: new Date("2023-01-01"),
      modifiedAt: new Date("2023-01-01"),
      children: [
        {
          id: "system",
          name: "System",
          type: "folder",
          size: 0,
          createdAt: new Date("2023-01-01"),
          modifiedAt: new Date("2023-01-01"),
          children: [
            {
              id: "kernel.sys",
              name: "kernel.sys",
              type: "file",
              content: "System kernel file",
              size: 1024,
              createdAt: new Date("2023-01-01"),
              modifiedAt: new Date("2023-01-01"),
            },
            {
              id: "drivers",
              name: "Drivers",
              type: "folder",
              size: 0,
              createdAt: new Date("2023-01-01"),
              modifiedAt: new Date("2023-01-01"),
              children: [
                {
                  id: "keyboard.drv",
                  name: "keyboard.drv",
                  type: "file",
                  content: "Keyboard driver",
                  size: 512,
                  createdAt: new Date("2023-01-01"),
                  modifiedAt: new Date("2023-01-01"),
                },
                {
                  id: "display.drv",
                  name: "display.drv",
                  type: "file",
                  content: "Display driver",
                  size: 768,
                  createdAt: new Date("2023-01-01"),
                  modifiedAt: new Date("2023-01-01"),
                },
                {
                  id: "network.drv",
                  name: "network.drv",
                  type: "file",
                  content: "Network driver",
                  size: 896,
                  createdAt: new Date("2023-01-01"),
                  modifiedAt: new Date("2023-01-01"),
                },
              ],
            },
          ],
        },
        {
          id: "documents",
          name: "Documents",
          type: "folder",
          size: 0,
          createdAt: new Date("2023-01-01"),
          modifiedAt: new Date("2023-01-01"),
          children: [
            {
              id: "readme.txt",
              name: "readme.txt",
              type: "file",
              content: "Welcome to AdagiOS!",
              size: 256,
              createdAt: new Date("2023-01-01"),
              modifiedAt: new Date("2023-01-01"),
            },
            {
              id: "notes.txt",
              name: "notes.txt",
              type: "file",
              content: "Important system notes",
              size: 384,
              createdAt: new Date("2023-01-01"),
              modifiedAt: new Date("2023-01-01"),
            },
          ],
        },
        {
          id: "applications",
          name: "Applications",
          type: "folder",
          size: 0,
          createdAt: new Date("2023-01-01"),
          modifiedAt: new Date("2023-01-01"),
          children: [
            {
              id: "notepad.app",
              name: "notepad.app",
              type: "file",
              content: "Notepad application",
              size: 2048,
              createdAt: new Date("2023-01-01"),
              modifiedAt: new Date("2023-01-01"),
            },
            {
              id: "browser.app",
              name: "browser.app",
              type: "file",
              content: "Browser application",
              size: 4096,
              createdAt: new Date("2023-01-01"),
              modifiedAt: new Date("2023-01-01"),
            },
            {
              id: "game.app",
              name: "game.app",
              type: "file",
              content: "Game application",
              size: 8192,
              createdAt: new Date("2023-01-01"),
              modifiedAt: new Date("2023-01-01"),
            },
          ],
        },
      ],
    },
  ])

  const [currentPath, setCurrentPath] = useState<string[]>(["root"])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Get current folder based on path
  const getCurrentFolder = (): FileSystemItem | null => {
    let current: FileSystemItem | undefined = fileSystem[0]

    for (let i = 1; i < currentPath.length; i++) {
      if (!current.children) return null
      current = current.children.find((item) => item.id === currentPath[i])
      if (!current) return null
    }

    return current
  }

  const currentFolder = getCurrentFolder()

  // Filter items based on search query
  const filteredItems =
    currentFolder?.children?.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())) || []

  const navigateToFolder = (folderId: string) => {
    setCurrentPath([...currentPath, folderId])
    setSelectedItem(null)
  }

  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedItem(null)
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="mb-2 flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={navigateUp} disabled={currentPath.length <= 1}>
          <FolderOpen className="mr-1 h-4 w-4" />
          Up
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-1 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="mr-1 h-4 w-4" />
          New
        </Button>
        <Input
          className="ml-auto w-48"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Path */}
      <div className="mb-2 flex items-center rounded border border-indigo-700 bg-indigo-900/50 px-2 py-1 text-sm">
        <HardDrive className="mr-1 h-4 w-4" />
        {currentPath.join(" > ")}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto rounded border border-indigo-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-indigo-700 bg-indigo-900/50 text-left text-xs">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Modified</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-indigo-800/30 text-sm hover:bg-indigo-800/30 ${
                  selectedItem === item.id ? "bg-indigo-800/50" : ""
                }`}
                onClick={() => setSelectedItem(item.id)}
                onDoubleClick={() => {
                  if (item.type === "folder") {
                    navigateToFolder(item.id)
                  }
                }}
              >
                <td className="flex items-center px-4 py-2">
                  {item.type === "folder" ? (
                    <Folder className="mr-2 h-4 w-4 text-yellow-400" />
                  ) : (
                    <File className="mr-2 h-4 w-4 text-blue-400" />
                  )}
                  {item.name}
                </td>
                <td className="px-4 py-2">{item.type === "folder" ? "--" : formatSize(item.size)}</td>
                <td className="px-4 py-2">{item.type === "folder" ? "Folder" : "File"}</td>
                <td className="px-4 py-2">{formatDate(item.modifiedAt)}</td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-indigo-400">
                  {searchQuery ? "No files match your search" : "This folder is empty"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="mt-2 flex items-center justify-between rounded border border-indigo-700 bg-indigo-900/50 px-2 py-1 text-xs">
        <div>{filteredItems.length} items</div>
        <div>
          {selectedItem
            ? `Selected: ${filteredItems.find((item) => item.id === selectedItem)?.name || ""}`
            : "No item selected"}
        </div>
      </div>
    </div>
  )
}
