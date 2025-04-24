
// from cordinates and icon size, get the row and column
export function getRowAndColumn(x: number, y: number, iconSize: number): [number, number] {
    const row = Math.ceil(y / iconSize);
    const column = Math.ceil(x / iconSize);
    return [row, column];
}

export const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }