import { useState, useEffect, memo } from "react"
import { Clock, Cpu, HardDrive } from "lucide-react"
import useMovilStore, { Process } from "@stores/movil"
import { formatUptime } from "@/utils"

function ProcessList() {
  const processes = useMovilStore((state) => state.process)
  const setProcesses = useMovilStore((state) => state.UpdateAllProcesses)
  const initTime = useMovilStore((state) => state.initTime)

  const [activeTab, setActiveTab] = useState("info")
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 67,
    memoryUsage: processes.reduce((acc, process) => acc + process.memory, 0),
    uptime: Math.floor((Date.now() - initTime) / 1000),
    loadAverage: [0.5, 1.88, 1.88],
    tasks: {
      total: processes.length,
      running: processes.filter((process) => process.cpu > 0).length,
      sleeping: processes.filter((process) => process.cpu === 0).length
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const newProcesses = processes.map((process) => ({
        ...process,
        cpu: Number((Math.random() * 5).toFixed(1)),
        memory: process.name.toLowerCase().includes("chrome")
          ? Number((Math.random() * 20).toFixed(1))
          : Number((Math.random() * 3).toFixed(1))
      }))
      setProcesses(newProcesses)
      const memoryUsage = newProcesses.reduce((acc, process) => acc + process.memory, 0)
      setSystemInfo({
        cpuUsage: Number((Math.random() * 100).toFixed(1)),
        memoryUsage: memoryUsage,
        uptime: Math.floor((Date.now() - initTime) / 1000),
        loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2],
        tasks: {
          total: newProcesses.length,
          running: newProcesses.filter((process) => process.cpu > 0).length,
          sleeping: newProcesses.filter((process) => process.cpu === 0).length
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [processes, initTime, setProcesses])

  const renderSystemInfo = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de CPU */}
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="h-6 w-6" />
            <span className="text-lg font-medium">CPU Usage</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${systemInfo.cpuUsage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-sm text-gray-400">{systemInfo.cpuUsage}% used</div>
        </div>
        {/* Tarjeta de Memoria */}
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="h-6 w-6" />
            <span className="text-lg font-medium">Memory Usage</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${systemInfo.memoryUsage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-sm text-gray-400">
            {systemInfo.memoryUsage.toFixed(2)}% used
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>Uptime: {formatUptime(systemInfo.uptime)}</span>
        </div>
        <div>
          Load Average:{" "}
          {systemInfo.loadAverage.map((load) => load.toFixed(2)).join(" ")}
        </div>
        <div>
          Tasks: {systemInfo.tasks.total} total, {systemInfo.tasks.running} running,{" "}
          {systemInfo.tasks.sleeping} sleeping
        </div>
      </div>
    </div>
  )

  const renderProcessList = () => (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">PID</th>
            <th className="px-4 py-2 text-left">USER</th>
            <th className="px-4 py-2 text-left">PRI</th>
            <th className="px-4 py-2 text-left">CPU%</th>
            <th className="px-4 py-2 text-left">MEM%</th>
            <th className="px-4 py-2 text-left">TIME+</th>
            <th className="px-4 py-2 text-left">Command</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          <ProcessElement
            key={1}
            process={{
              pid: 1,
              user: "root",
              priority: 20,
              cpu: 1,
              memory: 0.1,
              time: "0:00.00",
              name: "init",
              urlIcon: "",
              component: () => <></>
            }}
          />
          {processes.map((process) => (
            <ProcessElement key={process.pid} process={process} />
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-200">
      <header className="p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold font-mono">Monitoreo OS</h1>
      </header>
      {/* Navegación de pestañas */}
      <nav className="flex justify-center bg-gray-800">
        <button
          className={`px-4 py-2 m-2 rounded-md font-semibold ${
            activeTab === "info" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("info")}
        >
          System Info
        </button>
        <button
          className={`px-4 py-2 m-2 rounded-md font-semibold ${
            activeTab === "processes" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("processes")}
        >
          Process List
        </button>
      </nav>
      <main className="p-6">
        {activeTab === "info" ? renderSystemInfo() : renderProcessList()}
      </main>
    </div>
  )
}

interface ProcessElementProps {
  process: Process
}

function ProcessElement({ process }: ProcessElementProps) {
  return (
    <tr className="hover:bg-gray-700 transition-colors">
      <td className="px-4 py-2 font-mono">{process.pid}</td>
      <td className="px-4 py-2 font-mono">{process.user}</td>
      <td className="px-4 py-2 font-mono">{process.priority}</td>
      <td className="px-4 py-2 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${process.cpu * 20}%` }}
            ></div>
          </div>
          {process.cpu}
        </div>
      </td>
      <td className="px-4 py-2 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${process.memory * 33}%` }}
            ></div>
          </div>
          {process.memory}
        </div>
      </td>
      <td className="px-4 py-2 font-mono">{process.time}</td>
      <td className="px-4 py-2 font-mono text-xs truncate max-w-[200px]">
        {process.name}
      </td>
    </tr>
  )
}

export default memo(ProcessList)
