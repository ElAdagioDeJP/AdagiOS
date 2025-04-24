"use client"

import { useEffect, useState } from "react"
import { Activity, Cpu, HardDrive, Keyboard, Monitor, Network, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SystemMonitor() {
  const [cpuUsage, setCpuUsage] = useState(25)
  const [memoryUsage, setMemoryUsage] = useState(512)
  const [diskUsage, setDiskUsage] = useState(2048)
  const [networkUsage, setNetworkUsage] = useState({ upload: 0.5, download: 1.2 })
  const [keyboardEvents, setKeyboardEvents] = useState(0)
  const [displayEvents, setDisplayEvents] = useState(0)
  const [systemUptime, setSystemUptime] = useState(0)
  const [processCount, setProcessCount] = useState(12)
  const [threadCount, setThreadCount] = useState(24)
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "[System] AdagiOS initialized successfully",
    "[Kernel] Loading system drivers...",
    "[Driver] Keyboard driver loaded",
    "[Driver] Display driver loaded",
    "[Driver] Network driver loaded",
    "[System] Starting user interface...",
    "[System] Desktop environment loaded",
    "[System] System ready",
  ])

  // Total system resources
  const totalMemory = 1024 // 1024 MB
  const totalDisk = 10240 // 10 GB

  // Simulate system activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Update CPU usage (random fluctuation)
      setCpuUsage((prev) => {
        const newValue = prev + (Math.random() * 10 - 5)
        return Math.min(100, Math.max(5, newValue))
      })

      // Update memory usage (slow increase, occasional decrease)
      setMemoryUsage((prev) => {
        if (Math.random() < 0.8) {
          // 80% chance to increase
          return Math.min(totalMemory, prev + Math.random() * 10)
        } else {
          // 20% chance to decrease
          return Math.max(256, prev - Math.random() * 50)
        }
      })

      // Update disk usage (very slow increase)
      setDiskUsage((prev) => {
        if (Math.random() < 0.3) {
          // 30% chance to increase
          return Math.min(totalDisk, prev + Math.random() * 5)
        } else {
          return prev
        }
      })

      // Update network usage
      setNetworkUsage({
        upload: Math.max(0.1, Math.min(5, Math.random() * 2)),
        download: Math.max(0.2, Math.min(10, Math.random() * 4)),
      })

      // Update I/O events
      if (Math.random() < 0.5) {
        setKeyboardEvents((prev) => prev + Math.floor(Math.random() * 5))
      }
      setDisplayEvents((prev) => prev + Math.floor(Math.random() * 10))

      // Update system uptime
      setSystemUptime((prev) => prev + 1)

      // Update process count (occasional fluctuation)
      if (Math.random() < 0.2) {
        setProcessCount((prev) => {
          const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
          return Math.max(8, prev + change)
        })
      }

      // Update thread count
      setThreadCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 to 2
        return Math.max(processCount, prev + change)
      })

      // Add system log entry
      if (Math.random() < 0.2) {
        const logEntries = [
          "[System] Memory optimization completed",
          "[Process] New process started: Background Task",
          "[Network] Network connection established",
          "[Disk] File system check completed",
          "[Memory] Page swapped to disk",
          "[CPU] Scheduling quantum adjusted",
          "[Process] Process terminated: Temporary Task",
          "[System] Resource monitoring active",
          "[Network] Network packet received",
          "[Memory] Memory defragmentation completed",
        ]

        const randomLog = logEntries[Math.floor(Math.random() * logEntries.length)]
        setSystemLogs((prev) => [randomLog, ...prev.slice(0, 19)]) // Keep last 20 logs
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [processCount])

  // Format uptime
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="overview">
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="io">I/O Devices</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 overflow-auto">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">CPU Usage</h3>
              </div>
              <div className="mb-1 text-2xl font-bold">{cpuUsage.toFixed(1)}%</div>
              <Progress value={cpuUsage} className="h-2" />
            </div>

            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <HardDrive className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Memory Usage</h3>
              </div>
              <div className="mb-1 text-2xl font-bold">
                {memoryUsage.toFixed(0)} MB / {totalMemory} MB
              </div>
              <Progress value={(memoryUsage / totalMemory) * 100} className="h-2" />
            </div>

            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Activity className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">System Activity</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Processes</div>
                  <div>{processCount}</div>
                </div>
                <div>
                  <div className="font-medium">Threads</div>
                  <div>{threadCount}</div>
                </div>
                <div>
                  <div className="font-medium">Uptime</div>
                  <div>{formatUptime(systemUptime)}</div>
                </div>
                <div>
                  <div className="font-medium">System Load</div>
                  <div>{(cpuUsage / 100).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Network className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Network Activity</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Upload</div>
                  <div>{networkUsage.upload.toFixed(1)} MB/s</div>
                </div>
                <div>
                  <div className="font-medium">Download</div>
                  <div>{networkUsage.download.toFixed(1)} MB/s</div>
                </div>
                <div>
                  <div className="font-medium">Keyboard Events</div>
                  <div>{keyboardEvents}</div>
                </div>
                <div>
                  <div className="font-medium">Display Events</div>
                  <div>{displayEvents}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Recent System Activity</h3>
              </div>
              <Button variant="outline" size="sm">
                Refresh
              </Button>
            </div>
            <div className="max-h-32 overflow-auto text-xs">
              {systemLogs.slice(0, 5).map((log, index) => (
                <div key={index} className="border-b border-indigo-800/30 py-1 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cpu" className="flex-1 overflow-auto">
          <div className="mb-4 rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">CPU Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">CPU Model:</span> AdagiOS Virtual CPU
              </div>
              <div>
                <span className="font-medium">Architecture:</span> 64-bit
              </div>
              <div>
                <span className="font-medium">Cores:</span> 4
              </div>
              <div>
                <span className="font-medium">Threads:</span> 8
              </div>
              <div>
                <span className="font-medium">Clock Speed:</span> 3.2 GHz
              </div>
              <div>
                <span className="font-medium">Cache:</span> 8 MB
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">CPU Usage</div>
            <Progress value={cpuUsage} className="h-4" />
            <div className="mt-1 text-right text-xs">{cpuUsage.toFixed(1)}%</div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Core Usage</div>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Core 1</span>
                  <span>{Math.min(100, cpuUsage + 10).toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(100, cpuUsage + 10)} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Core 2</span>
                  <span>{Math.max(0, cpuUsage - 5).toFixed(1)}%</span>
                </div>
                <Progress value={Math.max(0, cpuUsage - 5)} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Core 3</span>
                  <span>{Math.min(100, cpuUsage + 5).toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(100, cpuUsage + 5)} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Core 4</span>
                  <span>{Math.max(0, cpuUsage - 10).toFixed(1)}%</span>
                </div>
                <Progress value={Math.max(0, cpuUsage - 10)} className="h-2" />
              </div>
            </div>
          </div>

          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">CPU Scheduling</h3>
            <p className="mb-4 text-sm">
              AdagiOS uses a preemptive scheduling algorithm with priority considerations. The scheduler allocates CPU
              time to processes based on their priority and quantum.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Scheduling Algorithm:</span> Round Robin with Priority
              </div>
              <div>
                <span className="font-medium">Default Quantum:</span> 10ms
              </div>
              <div>
                <span className="font-medium">Context Switches:</span> {Math.floor(systemUptime * 10)}
              </div>
              <div>
                <span className="font-medium">Interrupts:</span> {Math.floor(systemUptime * 5)}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="memory" className="flex-1 overflow-auto">
          <div className="mb-4 rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">Memory Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Physical Memory:</span> {totalMemory} MB
              </div>
              <div>
                <span className="font-medium">Used Memory:</span> {memoryUsage.toFixed(0)} MB
              </div>
              <div>
                <span className="font-medium">Free Memory:</span> {(totalMemory - memoryUsage).toFixed(0)} MB
              </div>
              <div>
                <span className="font-medium">Memory Type:</span> Virtual DDR4
              </div>
              <div>
                <span className="font-medium">Page Size:</span> 4 KB
              </div>
              <div>
                <span className="font-medium">Swap Space:</span> 2048 MB
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Memory Usage</div>
            <Progress value={(memoryUsage / totalMemory) * 100} className="h-4" />
            <div className="mt-1 flex justify-between text-xs">
              <span>Used: {memoryUsage.toFixed(0)} MB</span>
              <span>Free: {(totalMemory - memoryUsage).toFixed(0)} MB</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Memory Allocation</div>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>System</span>
                  <span>192 MB</span>
                </div>
                <Progress value={(192 / totalMemory) * 100} className="h-2 bg-purple-900">
                  <div className="h-full bg-purple-600" style={{ width: `${(192 / totalMemory) * 100}%` }} />
                </Progress>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Applications</span>
                  <span>{(memoryUsage - 192).toFixed(0)} MB</span>
                </div>
                <Progress value={((memoryUsage - 192) / totalMemory) * 100} className="h-2 bg-blue-900">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${((memoryUsage - 192) / totalMemory) * 100}%` }}
                  />
                </Progress>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Free</span>
                  <span>{(totalMemory - memoryUsage).toFixed(0)} MB</span>
                </div>
                <Progress value={((totalMemory - memoryUsage) / totalMemory) * 100} className="h-2 bg-gray-900">
                  <div
                    className="h-full bg-gray-600"
                    style={{ width: `${((totalMemory - memoryUsage) / totalMemory) * 100}%` }}
                  />
                </Progress>
              </div>
            </div>
          </div>

          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">Disk Usage</h3>
            <div className="mb-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Disk Space:</span> {totalDisk} MB
              </div>
              <div>
                <span className="font-medium">Used Disk Space:</span> {diskUsage.toFixed(0)} MB
              </div>
              <div>
                <span className="font-medium">Free Disk Space:</span> {(totalDisk - diskUsage).toFixed(0)} MB
              </div>
              <div>
                <span className="font-medium">Disk Type:</span> Virtual SSD
              </div>
            </div>

            <div className="mb-1 text-sm font-medium">Disk Usage</div>
            <Progress value={(diskUsage / totalDisk) * 100} className="h-2" />
            <div className="mt-1 flex justify-between text-xs">
              <span>Used: {diskUsage.toFixed(0)} MB</span>
              <span>Free: {(totalDisk - diskUsage).toFixed(0)} MB</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="io" className="flex-1 overflow-auto">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Keyboard className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Keyboard</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Status</div>
                  <div className="text-green-400">Connected</div>
                </div>
                <div>
                  <div className="font-medium">Type</div>
                  <div>Virtual Keyboard</div>
                </div>
                <div>
                  <div className="font-medium">Events</div>
                  <div>{keyboardEvents}</div>
                </div>
                <div>
                  <div className="font-medium">Driver</div>
                  <div>keyboard.drv</div>
                </div>
              </div>
            </div>

            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Monitor className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Display</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Status</div>
                  <div className="text-green-400">Connected</div>
                </div>
                <div>
                  <div className="font-medium">Resolution</div>
                  <div>1920x1080</div>
                </div>
                <div>
                  <div className="font-medium">Events</div>
                  <div>{displayEvents}</div>
                </div>
                <div>
                  <div className="font-medium">Driver</div>
                  <div>display.drv</div>
                </div>
              </div>
            </div>

            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Network className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Network</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Status</div>
                  <div className="text-green-400">Connected</div>
                </div>
                <div>
                  <div className="font-medium">Type</div>
                  <div>Virtual Ethernet</div>
                </div>
                <div>
                  <div className="font-medium">Upload</div>
                  <div>{networkUsage.upload.toFixed(1)} MB/s</div>
                </div>
                <div>
                  <div className="font-medium">Download</div>
                  <div>{networkUsage.download.toFixed(1)} MB/s</div>
                </div>
                <div>
                  <div className="font-medium">IP Address</div>
                  <div>192.168.1.100</div>
                </div>
                <div>
                  <div className="font-medium">Driver</div>
                  <div>network.drv</div>
                </div>
              </div>
            </div>

            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <HardDrive className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Storage</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Status</div>
                  <div className="text-green-400">Connected</div>
                </div>
                <div>
                  <div className="font-medium">Type</div>
                  <div>Virtual SSD</div>
                </div>
                <div>
                  <div className="font-medium">Total Space</div>
                  <div>{totalDisk} MB</div>
                </div>
                <div>
                  <div className="font-medium">Used Space</div>
                  <div>{diskUsage.toFixed(0)} MB</div>
                </div>
                <div>
                  <div className="font-medium">Read Speed</div>
                  <div>500 MB/s</div>
                </div>
                <div>
                  <div className="font-medium">Write Speed</div>
                  <div>350 MB/s</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">I/O Management</h3>
            <p className="mb-4 text-sm">
              AdagiOS manages input/output operations through device drivers and system calls. The I/O subsystem handles
              device communication, buffering, and error handling.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">I/O Scheduler:</span> Completely Fair Queuing
              </div>
              <div>
                <span className="font-medium">I/O Priority:</span> Based on process priority
              </div>
              <div>
                <span className="font-medium">Buffer Size:</span> 64 KB
              </div>
              <div>
                <span className="font-medium">I/O Operations:</span> {Math.floor(systemUptime * 8)}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="flex-1 overflow-auto">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium">System Logs</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <div className="max-h-96 overflow-auto font-mono text-xs">
              {systemLogs.map((log, index) => (
                <div key={index} className="border-b border-indigo-800/30 py-1 last:border-0">
                  <span className="text-indigo-400">[{formatUptime(systemUptime - index * 5)}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
