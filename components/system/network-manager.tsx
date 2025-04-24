"use client"

import { useEffect, useState } from "react"
import { Activity, Globe, RefreshCw, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NetworkConnection {
  id: number
  source: string
  destination: string
  protocol: string
  status: "active" | "idle" | "closed"
  bytesTransferred: number
  startTime: Date
}

interface NetworkPacket {
  id: number
  source: string
  destination: string
  protocol: string
  size: number
  timestamp: Date
}

export default function NetworkManager() {
  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>([])
  const [networkPackets, setNetworkPackets] = useState<NetworkPacket[]>([])
  const [uploadSpeed, setUploadSpeed] = useState(0.5)
  const [downloadSpeed, setDownloadSpeed] = useState(1.2)
  const [totalUploaded, setTotalUploaded] = useState(25)
  const [totalDownloaded, setTotalDownloaded] = useState(120)
  const [networkStatus, setNetworkStatus] = useState("Connected")
  const [signalStrength, setSignalStrength] = useState(85)
  const [packetLoss, setPacketLoss] = useState(0.5)
  const [latency, setLatency] = useState(15)

  // Initialize network connections
  useEffect(() => {
    const initialConnections: NetworkConnection[] = [
      {
        id: 1,
        source: "192.168.1.100:3000",
        destination: "192.168.1.1:80",
        protocol: "HTTP",
        status: "active",
        bytesTransferred: 1024,
        startTime: new Date(Date.now() - 60000), // 1 minute ago
      },
      {
        id: 2,
        source: "192.168.1.100:3001",
        destination: "8.8.8.8:53",
        protocol: "DNS",
        status: "idle",
        bytesTransferred: 256,
        startTime: new Date(Date.now() - 30000), // 30 seconds ago
      },
      {
        id: 3,
        source: "192.168.1.100:3002",
        destination: "172.217.169.78:443",
        protocol: "HTTPS",
        status: "active",
        bytesTransferred: 4096,
        startTime: new Date(Date.now() - 120000), // 2 minutes ago
      },
      {
        id: 4,
        source: "192.168.1.100:3003",
        destination: "239.255.255.250:1900",
        protocol: "SSDP",
        status: "idle",
        bytesTransferred: 512,
        startTime: new Date(Date.now() - 180000), // 3 minutes ago
      },
    ]

    setNetworkConnections(initialConnections)

    // Initialize packets
    const initialPackets: NetworkPacket[] = [
      {
        id: 1,
        source: "192.168.1.100:3000",
        destination: "192.168.1.1:80",
        protocol: "HTTP",
        size: 1024,
        timestamp: new Date(Date.now() - 5000), // 5 seconds ago
      },
      {
        id: 2,
        source: "192.168.1.1:80",
        destination: "192.168.1.100:3000",
        protocol: "HTTP",
        size: 2048,
        timestamp: new Date(Date.now() - 4000), // 4 seconds ago
      },
      {
        id: 3,
        source: "192.168.1.100:3002",
        destination: "172.217.169.78:443",
        protocol: "HTTPS",
        size: 512,
        timestamp: new Date(Date.now() - 3000), // 3 seconds ago
      },
      {
        id: 4,
        source: "172.217.169.78:443",
        destination: "192.168.1.100:3002",
        protocol: "HTTPS",
        size: 4096,
        timestamp: new Date(Date.now() - 2000), // 2 seconds ago
      },
      {
        id: 5,
        source: "192.168.1.100:3001",
        destination: "8.8.8.8:53",
        protocol: "DNS",
        size: 64,
        timestamp: new Date(Date.now() - 1000), // 1 second ago
      },
    ]

    setNetworkPackets(initialPackets)
  }, [])

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Update upload and download speeds
      setUploadSpeed((prev) => {
        const newValue = prev + (Math.random() * 0.4 - 0.2)
        return Math.max(0.1, Math.min(5, newValue))
      })

      setDownloadSpeed((prev) => {
        const newValue = prev + (Math.random() * 0.8 - 0.4)
        return Math.max(0.2, Math.min(10, newValue))
      })

      // Update total transferred
      setTotalUploaded((prev) => prev + uploadSpeed)
      setTotalDownloaded((prev) => prev + downloadSpeed)

      // Update signal strength
      setSignalStrength((prev) => {
        const newValue = prev + (Math.random() * 4 - 2)
        return Math.max(50, Math.min(100, newValue))
      })

      // Update packet loss
      setPacketLoss((prev) => {
        const newValue = prev + (Math.random() * 0.2 - 0.1)
        return Math.max(0, Math.min(5, newValue))
      })

      // Update latency
      setLatency((prev) => {
        const newValue = prev + (Math.random() * 4 - 2)
        return Math.max(5, Math.min(50, newValue))
      })

      // Update network connections
      setNetworkConnections((prevConnections) => {
        const newConnections = [...prevConnections]

        // Update existing connections
        newConnections.forEach((connection) => {
          if (connection.status === "active") {
            connection.bytesTransferred += Math.floor(Math.random() * 1024)
          }

          // Randomly change status
          if (Math.random() < 0.1) {
            if (connection.status === "active") {
              connection.status = "idle"
            } else if (connection.status === "idle") {
              connection.status = "active"
            }
          }
        })

        // Randomly add new connection
        if (Math.random() < 0.2 && newConnections.length < 10) {
          const protocols = ["HTTP", "HTTPS", "DNS", "SMTP", "FTP", "SSH"]
          const randomProtocol = protocols[Math.floor(Math.random() * protocols.length)]
          const randomPort = Math.floor(Math.random() * 1000) + 3000
          const randomDestPort =
            randomProtocol === "HTTP" ? 80 : randomProtocol === "HTTPS" ? 443 : Math.floor(Math.random() * 1000) + 1000
          const randomDestIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

          newConnections.push({
            id: Math.max(...newConnections.map((c) => c.id)) + 1,
            source: `192.168.1.100:${randomPort}`,
            destination: `${randomDestIP}:${randomDestPort}`,
            protocol: randomProtocol,
            status: "active",
            bytesTransferred: 0,
            startTime: new Date(),
          })
        }

        // Randomly close connection
        if (Math.random() < 0.1 && newConnections.length > 4) {
          const randomIndex = Math.floor(Math.random() * newConnections.length)
          newConnections[randomIndex].status = "closed"

          // Remove closed connections after a while
          if (Math.random() < 0.5) {
            const closedConnections = newConnections.filter((c) => c.status === "closed")
            if (closedConnections.length > 0) {
              const randomClosedIndex = Math.floor(Math.random() * closedConnections.length)
              const indexToRemove = newConnections.findIndex((c) => c.id === closedConnections[randomClosedIndex].id)
              if (indexToRemove !== -1) {
                newConnections.splice(indexToRemove, 1)
              }
            }
          }
        }

        return newConnections
      })

      // Update network packets
      setNetworkPackets((prevPackets) => {
        const newPackets = [...prevPackets]

        // Add new packet
        const activeConnections = networkConnections.filter((c) => c.status === "active")
        if (activeConnections.length > 0) {
          const randomConnection = activeConnections[Math.floor(Math.random() * activeConnections.length)]
          const isUpload = Math.random() < 0.5

          const newPacket: NetworkPacket = {
            id: Math.max(...newPackets.map((p) => p.id)) + 1,
            source: isUpload ? randomConnection.source : randomConnection.destination,
            destination: isUpload ? randomConnection.destination : randomConnection.source,
            protocol: randomConnection.protocol,
            size: Math.floor(Math.random() * 4096) + 64,
            timestamp: new Date(),
          }

          newPackets.unshift(newPacket)

          // Keep only the last 20 packets
          if (newPackets.length > 20) {
            newPackets.pop()
          }
        }

        return newPackets
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [networkConnections, uploadSpeed, downloadSpeed])

  // Format time elapsed
  const formatTimeElapsed = (startTime: Date): string => {
    const elapsed = Date.now() - startTime.getTime()
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

  // Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "text-green-500"
      case "idle":
        return "text-yellow-500"
      case "closed":
        return "text-red-500"
      default:
        return ""
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="overview">
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="packets">Packets</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 overflow-auto">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Wifi className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Network Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Status</div>
                  <div className="text-green-400">{networkStatus}</div>
                </div>
                <div>
                  <div className="font-medium">IP Address</div>
                  <div>192.168.1.100</div>
                </div>
                <div>
                  <div className="font-medium">MAC Address</div>
                  <div>00:1A:2B:3C:4D:5E</div>
                </div>
                <div>
                  <div className="font-medium">Network Type</div>
                  <div>Virtual Ethernet</div>
                </div>
              </div>
            </div>

            <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
              <div className="mb-2 flex items-center">
                <Activity className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Network Activity</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Upload</div>
                  <div>{uploadSpeed.toFixed(1)} MB/s</div>
                </div>
                <div>
                  <div className="font-medium">Download</div>
                  <div>{downloadSpeed.toFixed(1)} MB/s</div>
                </div>
                <div>
                  <div className="font-medium">Total Uploaded</div>
                  <div>{totalUploaded.toFixed(1)} MB</div>
                </div>
                <div>
                  <div className="font-medium">Total Downloaded</div>
                  <div>{totalDownloaded.toFixed(1)} MB</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm font-medium">Signal Strength</div>
            <Progress value={signalStrength} className="h-2" />
            <div className="mt-1 flex justify-between text-xs">
              <span>Weak</span>
              <span>{signalStrength.toFixed(0)}%</span>
              <span>Strong</span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-1 text-sm font-medium">Packet Loss</div>
              <Progress value={(packetLoss / 5) * 100} className="h-2" />
              <div className="mt-1 text-right text-xs">{packetLoss.toFixed(1)}%</div>
            </div>

            <div>
              <div className="mb-1 text-sm font-medium">Latency</div>
              <Progress value={(latency / 50) * 100} className="h-2" />
              <div className="mt-1 text-right text-xs">{latency.toFixed(0)} ms</div>
            </div>
          </div>

          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-indigo-400" />
                <h3 className="font-medium">Active Connections</h3>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-1 h-4 w-4" />
                Refresh
              </Button>
            </div>
            <div className="max-h-32 overflow-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-indigo-700 bg-indigo-900/50 text-left">
                    <th className="px-2 py-1">Source</th>
                    <th className="px-2 py-1">Destination</th>
                    <th className="px-2 py-1">Protocol</th>
                    <th className="px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {networkConnections
                    .filter((conn) => conn.status !== "closed")
                    .slice(0, 5)
                    .map((connection) => (
                      <tr key={connection.id} className="border-b border-indigo-800/30 hover:bg-indigo-800/30">
                        <td className="px-2 py-1">{connection.source}</td>
                        <td className="px-2 py-1">{connection.destination}</td>
                        <td className="px-2 py-1">{connection.protocol}</td>
                        <td className={`px-2 py-1 ${getStatusColor(connection.status)}`}>{connection.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="connections" className="flex-1 overflow-auto">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Total Connections:</span> {networkConnections.length}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="rounded border border-indigo-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-indigo-700 bg-indigo-900/50 text-left text-xs">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">Destination</th>
                  <th className="px-4 py-2">Protocol</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Transferred</th>
                  <th className="px-4 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {networkConnections.map((connection) => (
                  <tr key={connection.id} className="border-b border-indigo-800/30 text-xs hover:bg-indigo-800/30">
                    <td className="px-4 py-2">{connection.id}</td>
                    <td className="px-4 py-2">{connection.source}</td>
                    <td className="px-4 py-2">{connection.destination}</td>
                    <td className="px-4 py-2">{connection.protocol}</td>
                    <td className={`px-4 py-2 ${getStatusColor(connection.status)}`}>{connection.status}</td>
                    <td className="px-4 py-2">{formatBytes(connection.bytesTransferred)}</td>
                    <td className="px-4 py-2">{formatTimeElapsed(connection.startTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="packets" className="flex-1 overflow-auto">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Recent Packets:</span> {networkPackets.length}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="rounded border border-indigo-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-indigo-700 bg-indigo-900/50 text-left text-xs">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">Destination</th>
                  <th className="px-4 py-2">Protocol</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {networkPackets.map((packet) => (
                  <tr key={packet.id} className="border-b border-indigo-800/30 text-xs hover:bg-indigo-800/30">
                    <td className="px-4 py-2">{packet.id}</td>
                    <td className="px-4 py-2">{packet.source}</td>
                    <td className="px-4 py-2">{packet.destination}</td>
                    <td className="px-4 py-2">{packet.protocol}</td>
                    <td className="px-4 py-2">{formatBytes(packet.size)}</td>
                    <td className="px-4 py-2">{packet.timestamp.toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="flex-1 overflow-auto">
          <div className="rounded border border-indigo-700 bg-indigo-900/30 p-4">
            <h3 className="mb-2 font-medium">Network Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Average Upload:</span>{" "}
                {(totalUploaded / Math.max(1, networkConnections.length)).toFixed(2)} MB/connection
              </div>
              <div>
                <span className="font-medium">Average Download:</span>{" "}
                {(totalDownloaded / Math.max(1, networkConnections.length)).toFixed(2)} MB/connection
              </div>
              <div>
                <span className="font-medium">Active Connections:</span>{" "}
                {networkConnections.filter((c) => c.status === "active").length}
              </div>
              <div>
                <span className="font-medium">Idle Connections:</span>{" "}
                {networkConnections.filter((c) => c.status === "idle").length}
              </div>
              <div>
                <span className="font-medium">Total Packets:</span> {networkPackets.length}
              </div>
              <div>
                <span className="font-medium">Network Quality:</span>{" "}
                {signalStrength > 80
                  ? "Excellent"
                  : signalStrength > 60
                    ? "Good"
                    : signalStrength > 40
                      ? "Fair"
                      : "Poor"}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
