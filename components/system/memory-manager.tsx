"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MemoryBlock {
  id: number
  start: number
  size: number
  processId: number | null
  processName: string | null
  type: "free" | "allocated" | "system"
}

interface MemoryPage {
  id: number
  processId: number | null
  processName: string | null
  inMemory: boolean
  lastAccessed: Date | null
  modified: boolean
}

export default function MemoryManager() {
  const totalMemory = 8000 // 1024 MB
  const pageSize = 8 // 4 MB per page
  const totalPages = totalMemory / pageSize

  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([])
  const [memoryPages, setMemoryPages] = useState<MemoryPage[]>([])
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [freeMemory, setFreeMemory] = useState(0)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [fragmentation, setFragmentation] = useState(0)

  // Initialize memory blocks
  useEffect(() => {
    // Create initial memory layout
    const initialBlocks: MemoryBlock[] = [
      {
        id: 1,
        start: 0,
        size: 128,
        processId: 0,
        processName: "System Kernel",
        type: "system",
      },
      {
        id: 2,
        start: 128,
        size: 64,
        processId: 1,
        processName: "System Services",
        type: "system",
      },
      {
        id: 3,
        start: 192,
        size: 128,
        processId: 2,
        processName: "File Manager",
        type: "allocated",
      },
      {
        id: 4,
        start: 320,
        size: 256,
        processId: 3,
        processName: "Browser",
        type: "allocated",
      },
      {
        id: 5,
        start: 576,
        size: 32,
        processId: 4,
        processName: "Notepad",
        type: "allocated",
      },
      {
        id: 6,
        start: 608,
        size: 16,
        processId: 5,
        processName: "Background Task",
        type: "allocated",
      },
      {
        id: 7,
        start: 624,
        size: 400,
        processId: null,
        processName: null,
        type: "free",
      },
    ]

    setMemoryBlocks(initialBlocks)

    // Initialize pages
    const initialPages: MemoryPage[] = []
    for (let i = 0; i < totalPages; i++) {
      // Find which process owns this page
      const pageStart = i * pageSize
      const pageEnd = pageStart + pageSize

      let processId: number | null = null
      let processName: string | null = null

      for (const block of initialBlocks) {
        const blockStart = block.start
        const blockEnd = blockStart + block.size

        // If page overlaps with this block
        if (pageStart < blockEnd && pageEnd > blockStart) {
          processId = block.processId
          processName = block.processName
          break
        }
      }

      initialPages.push({
        id: i,
        processId,
        processName,
        inMemory: true,
        lastAccessed: processId !== null ? new Date() : null,
        modified: Math.random() > 0.5,
      })
    }

    setMemoryPages(initialPages)
  }, [])

  // Update memory statistics
  useEffect(() => {
    // Calculate memory usage
    const used = memoryBlocks.reduce((total, block) => {
      return total + (block.type !== "free" ? block.size : 0)
    }, 0)

    setMemoryUsage(used)
    setFreeMemory(totalMemory - used)

    // Calculate fragmentation
    const freeBlocks = memoryBlocks.filter((block) => block.type === "free")
    const largestFreeBlock = Math.max(...freeBlocks.map((block) => block.size), 0)
    const totalFree = freeBlocks.reduce((total, block) => total + block.size, 0)

    if (totalFree > 0) {
      setFragmentation((1 - largestFreeBlock / totalFree) * 100)
    } else {
      setFragmentation(0)
    }
  }, [memoryBlocks])

  // Simulate memory operations
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate memory allocation and deallocation
      setMemoryBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks]

        // 20% chance to perform a memory operation
        if (Math.random() < 0.2) {
          if (Math.random() < 0.5) {
            // Allocate memory
            const freeBlocks = newBlocks.filter((block) => block.type === "free")

            if (freeBlocks.length > 0) {
              // Find a free block to allocate
              const randomFreeBlockIndex = Math.floor(Math.random() * freeBlocks.length)
              const freeBlock = freeBlocks[randomFreeBlockIndex]
              const blockIndex = newBlocks.findIndex((block) => block.id === freeBlock.id)

              // Determine size to allocate (between 16 and min(128, freeBlock.size))
              const sizeToAllocate = Math.min(Math.max(16, Math.floor(Math.random() * 128)), freeBlock.size)

              if (sizeToAllocate < freeBlock.size) {
                // Split the block
                const newProcessId = Math.floor(Math.random() * 1000) + 10 // Random process ID
                const newProcessName = `Process ${newProcessId}`

                // Update the existing block to be smaller
                newBlocks[blockIndex] = {
                  ...freeBlock,
                  size: freeBlock.size - sizeToAllocate,
                  start: freeBlock.start + sizeToAllocate,
                }

                // Insert the new allocated block
                newBlocks.splice(blockIndex, 0, {
                  id: Math.max(...newBlocks.map((b) => b.id)) + 1,
                  start: freeBlock.start,
                  size: sizeToAllocate,
                  processId: newProcessId,
                  processName: newProcessName,
                  type: "allocated",
                })
              } else {
                // Allocate the entire block
                newBlocks[blockIndex] = {
                  ...freeBlock,
                  processId: Math.floor(Math.random() * 1000) + 10,
                  processName: `Process ${Math.floor(Math.random() * 1000) + 10}`,
                  type: "allocated",
                }
              }
            }
          } else {
            // Deallocate memory
            const allocatedBlocks = newBlocks.filter(
              (block) => block.type === "allocated" && block.processId !== null && block.processId > 5,
            )

            if (allocatedBlocks.length > 0) {
              // Find an allocated block to free
              const randomAllocatedBlockIndex = Math.floor(Math.random() * allocatedBlocks.length)
              const allocatedBlock = allocatedBlocks[randomAllocatedBlockIndex]
              const blockIndex = newBlocks.findIndex((block) => block.id === allocatedBlock.id)

              // Free the block
              newBlocks[blockIndex] = {
                ...allocatedBlock,
                processId: null,
                processName: null,
                type: "free",
              }

              // Merge adjacent free blocks
              for (let i = 0; i < newBlocks.length - 1; i++) {
                if (
                  newBlocks[i].type === "free" &&
                  newBlocks[i + 1].type === "free" &&
                  newBlocks[i].start + newBlocks[i].size === newBlocks[i + 1].start
                ) {
                  // Merge blocks
                  newBlocks[i] = {
                    ...newBlocks[i],
                    size: newBlocks[i].size + newBlocks[i + 1].size,
                  }
                  newBlocks.splice(i + 1, 1)
                  i-- // Check this position again
                }
              }
            }
          }
        }

        return newBlocks
      })

      // Simulate page access and swapping
      setMemoryPages((prevPages) => {
        const newPages = [...prevPages]

        // Randomly access pages
        for (let i = 0; i < 5; i++) {
          const randomPageIndex = Math.floor(Math.random() * newPages.length)
          const page = newPages[randomPageIndex]

          if (page.processId !== null) {
            page.lastAccessed = new Date()
            page.modified = Math.random() > 0.7 // 30% chance to modify the page
          }
        }

        // Simulate page swapping (if memory pressure is high)
        if (freeMemory < 100) {
          // Find least recently used pages
          const pagesInMemory = newPages.filter((p) => p.inMemory && p.processId !== null && p.processId > 5)

          if (pagesInMemory.length > 0) {
            pagesInMemory.sort((a, b) => {
              if (!a.lastAccessed) return 1
              if (!b.lastAccessed) return -1
              return a.lastAccessed.getTime() - b.lastAccessed.getTime()
            })

            // Swap out the least recently used page
            const pageToSwap = pagesInMemory[0]
            const pageIndex = newPages.findIndex((p) => p.id === pageToSwap.id)

            if (pageIndex !== -1) {
              newPages[pageIndex] = {
                ...pageToSwap,
                inMemory: false,
              }
            }
          }
        } else {
          // Randomly swap in a page that's not in memory
          const pagesNotInMemory = newPages.filter((p) => !p.inMemory)

          if (pagesNotInMemory.length > 0) {
            const randomPageIndex = Math.floor(Math.random() * pagesNotInMemory.length)
            const pageToSwapIn = pagesNotInMemory[randomPageIndex]
            const pageIndex = newPages.findIndex((p) => p.id === pageToSwapIn.id)

            if (pageIndex !== -1) {
              newPages[pageIndex] = {
                ...pageToSwapIn,
                inMemory: true,
                lastAccessed: new Date(),
              }
            }
          }
        }

        return newPages
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [freeMemory])

  // Format memory size
  const formatMemorySize = (size: number): string => {
    return `${size} MB`
  }

  // Get block color based on type
  const getBlockColor = (type: string): string => {
    switch (type) {
      case "system":
        return "bg-purple-700"
      case "allocated":
        return "bg-blue-700"
      case "free":
        return "bg-gray-700"
      default:
        return ""
    }
  }

  // Get page color based on status
  const getPageColor = (page: MemoryPage): string => {
    if (!page.inMemory) return "bg-gray-700"
    if (page.processId === null) return "bg-gray-700"
    if (page.processId <= 1) return "bg-purple-700"
    if (page.modified) return "bg-green-700"
    return "bg-blue-700"
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="physical">
        <TabsList className="mb-2">
          <TabsTrigger value="physical">Physical Memory</TabsTrigger>
          <TabsTrigger value="virtual">Virtual Memory</TabsTrigger>
          <TabsTrigger value="allocation">Memory Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="flex-1 overflow-auto">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Total Memory:</span> {formatMemorySize(totalMemory)}
            </div>
            <div className="text-sm">
              <span className="font-medium">Used:</span> {formatMemorySize(memoryUsage)} (
              {((memoryUsage / totalMemory) * 100).toFixed(1)}%)
            </div>
            <div className="text-sm">
              <span className="font-medium">Free:</span> {formatMemorySize(freeMemory)}
            </div>
            <Button variant="outline" size="sm" className="ml-2">
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Memory Usage</div>
            <Progress value={(memoryUsage / totalMemory) * 100} className="h-2" />
            <div className="mt-1 flex justify-between text-xs">
              <div>0 MB</div>
              <div>{totalMemory / 2} MB</div>
              <div>{totalMemory} MB</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Memory Map</div>
            <div className="flex h-8 w-full overflow-hidden rounded border border-indigo-700">
              {memoryBlocks.map((block) => (
                <div
                  key={block.id}
                  className={`${getBlockColor(block.type)} relative cursor-pointer hover:opacity-80`}
                  style={{ width: `${(block.size / totalMemory) * 100}%` }}
                  onClick={() => setSelectedBlock(block.id)}
                  title={`${block.processName || "Free"} (${block.size} MB)`}
                />
              ))}
            </div>
            <div className="mt-2 flex space-x-4 text-xs">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded bg-purple-700" />
                System
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded bg-blue-700" />
                Allocated
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded bg-gray-700" />
                Free
              </div>
            </div>
          </div>

          {selectedBlock !== null && (
            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <h3 className="mb-2 text-sm font-medium">Memory Block Details</h3>
              {(() => {
                const block = memoryBlocks.find((b) => b.id === selectedBlock)
                if (!block) return null

                return (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Block ID:</span> {block.id}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {block.type}
                    </div>
                    <div>
                      <span className="font-medium">Start Address:</span> {block.start} MB
                    </div>
                    <div>
                      <span className="font-medium">End Address:</span> {block.start + block.size} MB
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {block.size} MB
                    </div>
                    <div>
                      <span className="font-medium">Process ID:</span> {block.processId || "None"}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Process Name:</span> {block.processName || "None"}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </TabsContent>

        <TabsContent value="virtual" className="flex-1 overflow-auto">
          <div className="mb-4 rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">Virtual Memory System</h3>
            <p className="mb-4 text-sm">
              AdagiOS uses a paging system for virtual memory management. Physical memory is divided into fixed-size
              frames, and each process's virtual address space is divided into pages of the same size.
            </p>

            <div className="mb-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Page Size:</span> {pageSize} MB
              </div>
              <div>
                <span className="font-medium">Total Pages:</span> {totalPages}
              </div>
              <div>
                <span className="font-medium">Pages In Memory:</span> {memoryPages.filter((p) => p.inMemory).length}
              </div>
              <div>
                <span className="font-medium">Pages Swapped:</span> {memoryPages.filter((p) => !p.inMemory).length}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Page Table</div>
            <div className="max-h-64 overflow-auto rounded border border-indigo-700">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-indigo-700 bg-indigo-900/50 text-left text-xs">
                    <th className="px-4 py-2">Page #</th>
                    <th className="px-4 py-2">Process</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Modified</th>
                    <th className="px-4 py-2">Last Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {memoryPages.map((page) => (
                    <tr key={page.id} className="border-b border-indigo-800/30 text-xs hover:bg-indigo-800/30">
                      <td className="px-4 py-2">{page.id}</td>
                      <td className="px-4 py-2">{page.processName || "Free"}</td>
                      <td className="px-4 py-2">
                        {page.inMemory ? (
                          <span className="text-green-400">In Memory</span>
                        ) : (
                          <span className="text-yellow-400">Swapped</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {page.modified ? <span className="text-red-400">Yes</span> : <span>No</span>}
                      </td>
                      <td className="px-4 py-2">
                        {page.lastAccessed ? page.lastAccessed.toLocaleTimeString() : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Memory Pages Visualization</div>
            <div className="grid grid-cols-16 gap-1">
              {memoryPages.slice(0, 256).map((page) => (
                <div
                  key={page.id}
                  className={`h-4 w-full rounded ${getPageColor(page)}`}
                  title={`Page ${page.id}: ${page.processName || "Free"} (${page.inMemory ? "In Memory" : "Swapped"})`}
                />
              ))}
            </div>
            <div className="mt-2 flex space-x-4 text-xs">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded bg-purple-700" />
                System
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded bg-blue-700" />
                In Memory
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded bg-green-700" />
                Modified
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded bg-gray-700" />
                Free/Swapped
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="flex-1 overflow-auto">
          <div className="mb-4 rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">Memory Allocation</h3>
            <p className="mb-4 text-sm">
              AdagiOS uses a combination of allocation strategies to manage memory efficiently. The system tracks free
              memory blocks and allocates them based on process requirements.
            </p>

            <div className="mb-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Free Memory:</span> {formatMemorySize(freeMemory)}
              </div>
              <div>
                <span className="font-medium">Fragmentation:</span> {fragmentation.toFixed(1)}%
              </div>
              <div>
                <span className="font-medium">Free Blocks:</span> {memoryBlocks.filter((b) => b.type === "free").length}
              </div>
              <div>
                <span className="font-medium">Allocated Blocks:</span>{" "}
                {memoryBlocks.filter((b) => b.type !== "free").length}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Memory Allocation Strategies</div>
            <div className="space-y-2 rounded border border-indigo-700 bg-indigo-900/30 p-4 text-sm">
              <div>
                <h4 className="font-medium">First Fit</h4>
                <p className="text-xs">
                  Allocates the first free block that is large enough to satisfy the request. Fast but can lead to
                  fragmentation.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Best Fit</h4>
                <p className="text-xs">
                  Allocates the smallest free block that is large enough to satisfy the request. Minimizes wasted space
                  but can be slower.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Worst Fit</h4>
                <p className="text-xs">
                  Allocates the largest free block available. Leaves larger free blocks which may be more useful.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Buddy System</h4>
                <p className="text-xs">
                  Divides memory into power-of-2 sized blocks. Efficient for allocation and deallocation but can waste
                  memory.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Memory Blocks</div>
            <div className="rounded border border-indigo-700">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-indigo-700 bg-indigo-900/50 text-left text-xs">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Start</th>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">End</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {memoryBlocks.map((block) => (
                    <tr
                      key={block.id}
                      className={`border-b border-indigo-800/30 text-xs hover:bg-indigo-800/30 ${
                        selectedBlock === block.id ? "bg-indigo-800/50" : ""
                      }`}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <td className="px-4 py-2">{block.id}</td>
                      <td className="px-4 py-2">{block.start} MB</td>
                      <td className="px-4 py-2">{block.size} MB</td>
                      <td className="px-4 py-2">{block.start + block.size} MB</td>
                      <td className="px-4 py-2">{block.type}</td>
                      <td className="px-4 py-2">{block.processName || "None"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
