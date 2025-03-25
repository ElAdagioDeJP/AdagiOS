import { useState, useEffect, memo } from "react"
import { Clock, Cpu, HardDrive } from "lucide-react"
import useMovilStore, { Process } from "@stores/movil"
import { formatUptime } from "@/utils"




 function ProcessList() {
  const processes = useMovilStore((state) => state.process)
  const setProcesses = useMovilStore((state) => state.UpdateAllProcesses)

  const initTime = useMovilStore((state)=> state.initTime)

  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 67,
    memoryUsage: processes.reduce((acc, process) => acc + process.memory, 0),
    uptime:  Math.floor((Date.now() - initTime) / 1000),
    loadAverage: [0.5, 1.88, 1.88],
    tasks:  { total: processes.length, running: processes.filter(process => process.cpu > 0).length, sleeping: processes.filter(process => process.cpu === 0).length }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const newProcesses = processes.map(process => ({
        ...process,
        cpu: Number((Math.random() * 5).toFixed(1)),
        memory: process.name.toLowerCase().includes("chrome") ? Number((Math.random() * 20).toFixed(1)) : Number((Math.random() * 3).toFixed(1))
      }))
      setProcesses(newProcesses)

      // the memory usage base on the processes memory usage
      const memoryUsage = newProcesses.reduce((acc, process) => acc + process.memory, 0)

      setSystemInfo({
        cpuUsage: Number((Math.random() * 100).toFixed(1)),
        memoryUsage: memoryUsage,
        uptime: Math.floor((Date.now() - initTime) / 1000),
        loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2],
        tasks: { total: newProcesses.length, running: newProcesses.filter(process => process.cpu > 0).length, sleeping: newProcesses.filter(process => process.cpu === 0).length }
      })


    }, 2000)

    return () => clearInterval(interval)
  }, [])







  return (
    <div className="w-full  bg-gray-800 text-gray-200 shadow-lg overflow-hidden h-screen">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-mono font-bold">System Monitor</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              <span className="text-sm font-medium">CPU Usage</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${systemInfo.cpuUsage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              {systemInfo.cpuUsage}% used
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${systemInfo.memoryUsage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              {systemInfo.memoryUsage.toFixed(2)}% used
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Uptime: {formatUptime(systemInfo.uptime)}</span>
          </div>
          <div>
            Load Average: {systemInfo.loadAverage.map((load)=> load.toFixed(2)).join(" ")}
          </div>
          <div>
            Tasks: {systemInfo.tasks.total} total, {systemInfo.tasks.running} running, {systemInfo.tasks.sleeping} sleeping
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
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
          <ProcessElement key={process.pid} process={{
            pid: 1,
            user: "root",
            priority: 20,
            cpu: 1,
            memory: 0.1,
            time: "0:00.00",
            name: "init",
            urlIcon: "",
            component: () => { return <></> }
          }} />
            {processes.map((process) => (
              <ProcessElement key={process.pid} process={process} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


interface ProcessElementProps {
  process: Process
}

function ProcessElement({ process }: ProcessElementProps) {
  return (
    <tr key={process.pid} className="hover:bg-gray-700">
    <td className="px-4 py-2 font-mono">{process.pid}</td>
    <td className="px-4 py-2 font-mono">{process.user}</td>
    <td className="px-4 py-2 font-mono">{process.priority}</td>
    <td className="px-4 py-2 font-mono">
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${process.cpu * 20}%` }}
          ></div>
        </div>
        {process.cpu}
      </div>
    </td>
    <td className="px-4 py-2 font-mono">
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
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