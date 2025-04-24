"use client"

import { useEffect, useState } from "react"
import { Play, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Process {
  id: number
  name: string
  status: "running" | "waiting" | "blocked" | "terminated"
  priority: number
  cpuUsage: number
  memoryUsage: number
  startTime: Date
  quantum: number
  remainingQuantum: number
  waitingFor?: string
}

export default function ProcessManager() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [cpuUtilization, setCpuUtilization] = useState(0)
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null)
  const [deadlockDetected, setDeadlockDetected] = useState(false)
  const [starvationDetected, setStarvationDetected] = useState(false)

  // Initialize processes
  useEffect(() => {
    const initialProcesses: Process[] = [
      {
        id: 1,
        name: "System Kernel",
        status: "running",
        priority: 10,
        cpuUsage: 5,
        memoryUsage: 128,
        startTime: new Date(currentTime.getTime() - 300000), // 5 minutes ago
        quantum: 10,
        remainingQuantum: 8,
      },
      {
        id: 2,
        name: "File Manager",
        status: "running",
        priority: 5,
        cpuUsage: 15,
        memoryUsage: 64,
        startTime: new Date(currentTime.getTime() - 120000), // 2 minutes ago
        quantum: 5,
        remainingQuantum: 3,
      },
      {
        id: 3,
        name: "Browser",
        status: "running",
        priority: 3,
        cpuUsage: 30,
        memoryUsage: 256,
        startTime: new Date(currentTime.getTime() - 60000), // 1 minute ago
        quantum: 5,
        remainingQuantum: 1,
      },
      {
        id: 4,
        name: "Notepad",
        status: "waiting",
        priority: 2,
        cpuUsage: 0,
        memoryUsage: 32,
        startTime: new Date(currentTime.getTime() - 30000), // 30 seconds ago
        quantum: 3,
        remainingQuantum: 3,
        waitingFor: "User Input",
      },
      {
        id: 5,
        name: "Background Task",
        status: "blocked",
        priority: 1,
        cpuUsage: 0,
        memoryUsage: 16,
        startTime: new Date(currentTime.getTime() - 10000), // 10 seconds ago
        quantum: 2,
        remainingQuantum: 0,
        waitingFor: "Disk I/O",
      },
    ]

    setProcesses(initialProcesses)
  }, [])

  // Simulate process scheduling and updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())

      setProcesses((prevProcesses) => {
        // Create a copy to modify
        const updatedProcesses = [...prevProcesses]

        // Calculate total CPU usage
        let totalCpuUsage = 0

        // Update each process
        updatedProcesses.forEach((process) => {
          if (process.status === "running") {
            // Decrease remaining quantum
            process.remainingQuantum = Math.max(0, process.remainingQuantum - 1)

            // Randomly vary CPU usage
            process.cpuUsage = Math.min(100, Math.max(1, process.cpuUsage + (Math.random() * 10 - 5)))

            // If quantum is exhausted, move to waiting state
            if (process.remainingQuantum === 0) {
              process.status = "waiting"
              process.remainingQuantum = process.quantum
            }

            totalCpuUsage += process.cpuUsage
          }
        })

        // Randomly change process states
        if (Math.random() < 0.2) {
          // 20% chance to change a process state
          const randomIndex = Math.floor(Math.random() * updatedProcesses.length)
          const process = updatedProcesses[randomIndex]

          if (process.status === "waiting") {
            process.status = "running"
          } else if (process.status === "blocked" && Math.random() < 0.5) {
            process.status = "waiting"
            process.waitingFor = undefined
          }
        }

        // Randomly create deadlock situation (for demonstration)
        if (Math.random() < 0.05) {
          setDeadlockDetected(true)

          // Create a deadlock between two processes
          const process1 = updatedProcesses.find((p) => p.id === 2)
          const process2 = updatedProcesses.find((p) => p.id === 3)

          if (process1 && process2) {
            process1.status = "blocked"
            process1.waitingFor = "Resource held by Process 3"
            process2.status = "blocked"
            process2.waitingFor = "Resource held by Process 2"
          }
        } else if (deadlockDetected && Math.random() < 0.3) {
          // Resolve deadlock
          setDeadlockDetected(false)

          const process1 = updatedProcesses.find((p) => p.id === 2)
          const process2 = updatedProcesses.find((p) => p.id === 3)

          if (process1 && process2) {
            process1.status = "running"
            process1.waitingFor = undefined
            process2.status = "waiting"
            process2.waitingFor = undefined
          }
        }

        // Randomly create starvation situation (for demonstration)
        if (Math.random() < 0.05) {
          setStarvationDetected(true)

          // Make a low-priority process starve
          const lowPriorityProcess = updatedProcesses.find((p) => p.id === 5)
          if (lowPriorityProcess) {
            lowPriorityProcess.status = "waiting"
            lowPriorityProcess.waitingFor = "CPU time (starvation)"
          }
        } else if (starvationDetected && Math.random() < 0.3) {
          // Resolve starvation
          setStarvationDetected(false)

          const lowPriorityProcess = updatedProcesses.find((p) => p.id === 5)
          if (lowPriorityProcess) {
            lowPriorityProcess.status = "running"
            lowPriorityProcess.waitingFor = undefined
            lowPriorityProcess.priority = 8 // Temporarily boost priority
          }
        }

        // Set overall CPU utilization
        setCpuUtilization(Math.min(100, totalCpuUsage))

        return updatedProcesses
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [deadlockDetected, starvationDetected])

  // Format time elapsed
  const formatTimeElapsed = (startTime: Date): string => {
    const elapsed = currentTime.getTime() - startTime.getTime()
    const seconds = Math.floor(elapsed / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "running":
        return "text-green-500"
      case "waiting":
        return "text-yellow-500"
      case "blocked":
        return "text-red-500"
      case "terminated":
        return "text-gray-500"
      default:
        return ""
    }
  }

  // Handle process actions
  const terminateProcess = (id: number) => {
    setProcesses((prevProcesses) =>
      prevProcesses.map((process) => (process.id === id ? { ...process, status: "terminated", cpuUsage: 0 } : process)),
    )
  }

  const startProcess = (id: number) => {
    setProcesses((prevProcesses) =>
      prevProcesses.map((process) =>
        process.id === id ? { ...process, status: "running", remainingQuantum: process.quantum } : process,
      ),
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="processes">
        <TabsList className="mb-2">
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="scheduling">CPU Scheduling</TabsTrigger>
          <TabsTrigger value="deadlocks">Deadlocks</TabsTrigger>
        </TabsList>

        <TabsContent value="processes" className="flex-1 overflow-auto">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">CPU Utilization:</span>{" "}
              <Progress value={cpuUtilization} className="h-2 w-32 inline-block align-middle ml-2" />
              <span className="ml-2">{cpuUtilization.toFixed(1)}%</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Active Processes:</span>{" "}
              {processes.filter((p) => p.status !== "terminated").length}
            </div>
          </div>

          <div className="rounded border border-indigo-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-indigo-700 bg-indigo-900/50 text-left text-xs">
                  <th className="px-4 py-2">PID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">CPU</th>
                  <th className="px-4 py-2">Memory</th>
                  <th className="px-4 py-2">Priority</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process) => (
                  <tr
                    key={process.id}
                    className={`border-b border-indigo-800/30 text-sm hover:bg-indigo-800/30 ${
                      selectedProcess === process.id ? "bg-indigo-800/50" : ""
                    }`}
                    onClick={() => setSelectedProcess(process.id)}
                  >
                    <td className="px-4 py-2">{process.id}</td>
                    <td className="px-4 py-2">{process.name}</td>
                    <td className={`px-4 py-2 ${getStatusColor(process.status)}`}>
                      {process.status}
                      {process.waitingFor && <span className="text-xs block">{process.waitingFor}</span>}
                    </td>
                    <td className="px-4 py-2">
                      <Progress value={process.cpuUsage} className="h-2 w-16" />
                      <span className="text-xs ml-1">{process.cpuUsage.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-2">{process.memoryUsage} MB</td>
                    <td className="px-4 py-2">{process.priority}</td>
                    <td className="px-4 py-2">{formatTimeElapsed(process.startTime)}</td>
                    <td className="px-4 py-2">
                      {process.status !== "terminated" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                          onClick={() => terminateProcess(process.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                          onClick={() => startProcess(process.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedProcess && (
            <div className="mt-4 rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <h3 className="mb-2 text-sm font-medium">Process Details</h3>
              {(() => {
                const process = processes.find((p) => p.id === selectedProcess)
                if (!process) return null

                return (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Process ID:</span> {process.id}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span> {process.name}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <span className={getStatusColor(process.status)}>{process.status}</span>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> {process.priority}
                    </div>
                    <div>
                      <span className="font-medium">CPU Usage:</span> {process.cpuUsage.toFixed(1)}%
                    </div>
                    <div>
                      <span className="font-medium">Memory Usage:</span> {process.memoryUsage} MB
                    </div>
                    <div>
                      <span className="font-medium">Start Time:</span> {process.startTime.toLocaleTimeString()}
                    </div>
                    <div>
                      <span className="font-medium">Running For:</span> {formatTimeElapsed(process.startTime)}
                    </div>
                    <div>
                      <span className="font-medium">Quantum:</span> {process.quantum}
                    </div>
                    <div>
                      <span className="font-medium">Remaining Quantum:</span> {process.remainingQuantum}
                    </div>
                    {process.waitingFor && (
                      <div className="col-span-2">
                        <span className="font-medium">Waiting For:</span> {process.waitingFor}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduling" className="flex-1 overflow-auto">
          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">CPU Scheduling</h3>
            <p className="mb-4 text-sm">
              AdagiOS uses a quantum-based round-robin scheduling algorithm with priority considerations. Each process
              is assigned a time quantum and allowed to run until it completes or its quantum expires.
            </p>

            <h4 className="mb-1 text-sm font-medium">Current Scheduling Queue</h4>
            <div className="mb-4 overflow-x-auto">
              <div className="flex min-w-max space-x-2">
                {processes
                  .filter((p) => p.status !== "terminated")
                  .sort((a, b) => b.priority - a.priority)
                  .map((process) => (
                    <div
                      key={process.id}
                      className={`flex min-w-[100px] flex-col rounded border p-2 text-xs ${
                        process.status === "running"
                          ? "border-green-500 bg-green-900/20"
                          : process.status === "waiting"
                            ? "border-yellow-500 bg-yellow-900/20"
                            : "border-red-500 bg-red-900/20"
                      }`}
                    >
                      <div className="font-medium">{process.name}</div>
                      <div>PID: {process.id}</div>
                      <div>Priority: {process.priority}</div>
                      <div>Quantum: {process.quantum}</div>
                      <div>Remaining: {process.remainingQuantum}</div>
                      <div className={getStatusColor(process.status)}>{process.status}</div>
                    </div>
                  ))}
              </div>
            </div>

            <h4 className="mb-1 text-sm font-medium">Scheduling Concepts</h4>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                <span className="font-medium">Quantum:</span> Maximum time a process can run before being preempted
              </li>
              <li>
                <span className="font-medium">Priority:</span> Higher priority processes are scheduled more frequently
              </li>
              <li>
                <span className="font-medium">Starvation:</span> Low-priority processes may never get CPU time
              </li>
              <li>
                <span className="font-medium">Aging:</span> Gradually increasing priority of waiting processes
              </li>
            </ul>
          </div>

          {starvationDetected && (
            <div className="mt-4 rounded border border-yellow-600 bg-yellow-900/30 p-4">
              <h3 className="mb-2 font-medium text-yellow-400">Starvation Detected</h3>
              <p className="text-sm">
                Process 5 (Background Task) is experiencing starvation due to its low priority. The system will
                temporarily boost its priority to ensure it gets CPU time.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="deadlocks" className="flex-1 overflow-auto">
          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">Deadlock Management</h3>
            <p className="mb-4 text-sm">
              Deadlock occurs when two or more processes are unable to proceed because each is waiting for resources
              held by another. AdagiOS implements detection and resolution strategies.
            </p>

            <h4 className="mb-1 text-sm font-medium">Deadlock Conditions</h4>
            <ul className="mb-4 list-inside list-disc space-y-1 text-sm">
              <li>
                <span className="font-medium">Mutual Exclusion:</span> Resources cannot be shared
              </li>
              <li>
                <span className="font-medium">Hold and Wait:</span> Processes hold resources while waiting for others
              </li>
              <li>
                <span className="font-medium">No Preemption:</span> Resources cannot be forcibly taken from processes
              </li>
              <li>
                <span className="font-medium">Circular Wait:</span> Circular chain of processes waiting for resources
              </li>
            </ul>

            <h4 className="mb-1 text-sm font-medium">Deadlock Prevention Strategies</h4>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                <span className="font-medium">Resource Ordering:</span> Assign a global order to resource types
              </li>
              <li>
                <span className="font-medium">Resource Request All:</span> Request all resources at once
              </li>
              <li>
                <span className="font-medium">Resource Preemption:</span> Allow resources to be preempted
              </li>
              <li>
                <span className="font-medium">Deadlock Detection:</span> Periodically check for deadlocks
              </li>
            </ul>
          </div>

          {deadlockDetected && (
            <div className="mt-4 rounded border border-red-600 bg-red-900/30 p-4">
              <h3 className="mb-2 font-medium text-red-400">Deadlock Detected</h3>
              <p className="mb-2 text-sm">A deadlock has been detected between the following processes:</p>
              <ul className="mb-2 list-inside list-disc text-sm">
                <li>Process 2 (File Manager) is waiting for a resource held by Process 3</li>
                <li>Process 3 (Browser) is waiting for a resource held by Process 2</li>
              </ul>
              <p className="text-sm">
                The system will resolve this deadlock by terminating one of the processes or by preempting resources.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
