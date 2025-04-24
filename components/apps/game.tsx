"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { RefreshCw, Flag, Clock, Bomb, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

// Tipos para el juego
type CellState = {
  revealed: boolean
  hasMine: boolean
  flagged: boolean
  adjacentMines: number
}

type Difficulty = "principiante" | "intermedio" | "experto"

type GameState = "waiting" | "playing" | "won" | "lost"

export default function Game() {
  // Configuración según dificultad
  const difficultySettings = {
    principiante: { rows: 9, cols: 9, mines: 10 },
    intermedio: { rows: 16, cols: 16, mines: 40 },
    experto: { rows: 16, cols: 30, mines: 99 },
  }

  // Estados del juego
  const [difficulty, setDifficulty] = useState<Difficulty>("principiante")
  const [board, setBoard] = useState<CellState[][]>([])
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [minesLeft, setMinesLeft] = useState(0)
  const [time, setTime] = useState(0)
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    principiante: null,
    intermedio: null,
    experto: null,
  })

  // Inicializar el tablero
  const initializeBoard = useCallback(() => {
    const { rows, cols, mines } = difficultySettings[difficulty]
    setMinesLeft(mines)
    setTime(0)
    setGameState("waiting")

    // Crear tablero vacío
    const newBoard: CellState[][] = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            revealed: false,
            hasMine: false,
            flagged: false,
            adjacentMines: 0,
          })),
      )

    setBoard(newBoard)
  }, [difficulty])

  // Colocar minas aleatoriamente (después del primer clic)
  const placeMines = (firstRow: number, firstCol: number) => {
    const { rows, cols, mines } = difficultySettings[difficulty]

    // Clonar el tablero actual
    const newBoard = JSON.parse(JSON.stringify(board)) as CellState[][]

    // Colocar minas aleatoriamente
    let minesPlaced = 0
    while (minesPlaced < mines) {
      const randomRow = Math.floor(Math.random() * rows)
      const randomCol = Math.floor(Math.random() * cols)

      // Evitar colocar mina en la primera celda clicada o donde ya hay una mina
      if (
        (randomRow === firstRow && randomCol === firstCol) ||
        newBoard[randomRow][randomCol].hasMine ||
        // Evitar también las celdas adyacentes al primer clic para un inicio más amigable
        (Math.abs(randomRow - firstRow) <= 1 && Math.abs(randomCol - firstCol) <= 1)
      ) {
        continue
      }

      newBoard[randomRow][randomCol].hasMine = true
      minesPlaced++
    }

    // Calcular minas adyacentes para cada celda
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (newBoard[row][col].hasMine) continue

        let count = 0
        // Revisar las 8 celdas adyacentes
        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
            if (r === row && c === col) continue
            if (newBoard[r][c].hasMine) count++
          }
        }

        newBoard[row][col].adjacentMines = count
      }
    }

    setBoard(newBoard)
    setGameState("playing")
  }

  // Revelar celda
  const revealCell = (row: number, col: number) => {
    if (gameState === "lost" || gameState === "won") return
    if (board[row][col].flagged || board[row][col].revealed) return

    // Si es el primer clic, colocar minas
    if (gameState === "waiting") {
      placeMines(row, col)
      // Necesitamos esperar a que se actualice el estado del tablero
      setTimeout(() => revealCell(row, col), 50)
      return
    }

    const newBoard = JSON.parse(JSON.stringify(board)) as CellState[][]

    // Si hay una mina, fin del juego
    if (newBoard[row][col].hasMine) {
      // Revelar todas las minas
      for (let r = 0; r < newBoard.length; r++) {
        for (let c = 0; c < newBoard[0].length; c++) {
          if (newBoard[r][c].hasMine) {
            newBoard[r][c].revealed = true
          }
        }
      }
      setBoard(newBoard)
      setGameState("lost")
      return
    }

    // Función recursiva para revelar celdas
    const revealRecursive = (r: number, c: number) => {
      if (
        r < 0 ||
        r >= newBoard.length ||
        c < 0 ||
        c >= newBoard[0].length ||
        newBoard[r][c].revealed ||
        newBoard[r][c].flagged
      ) {
        return
      }

      newBoard[r][c].revealed = true

      // Si es una celda vacía (sin minas adyacentes), revelar celdas adyacentes
      if (newBoard[r][c].adjacentMines === 0) {
        for (let nr = Math.max(0, r - 1); nr <= Math.min(newBoard.length - 1, r + 1); nr++) {
          for (let nc = Math.max(0, c - 1); nc <= Math.min(newBoard[0].length - 1, c + 1); nc++) {
            if (nr === r && nc === c) continue
            revealRecursive(nr, nc)
          }
        }
      }
    }

    revealRecursive(row, col)
    setBoard(newBoard)

    // Verificar victoria
    checkWinCondition(newBoard)
  }

  // Marcar/desmarcar bandera
  const toggleFlag = (row: number, col: number) => {
    if (gameState !== "playing" || board[row][col].revealed) return

    const newBoard = JSON.parse(JSON.stringify(board)) as CellState[][]

    if (newBoard[row][col].flagged) {
      newBoard[row][col].flagged = false
      setMinesLeft(minesLeft + 1)
    } else {
      // Solo permitir colocar banderas si quedan minas por marcar
      if (minesLeft > 0) {
        newBoard[row][col].flagged = true
        setMinesLeft(minesLeft - 1)
      }
    }

    setBoard(newBoard)
  }

  // Verificar condición de victoria
  const checkWinCondition = (currentBoard: CellState[][]) => {
    const { rows, cols, mines } = difficultySettings[difficulty]

    // Contar celdas sin revelar
    let unrevealed = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentBoard[r][c].revealed) unrevealed++
      }
    }

    // Si el número de celdas sin revelar es igual al número de minas, victoria
    if (unrevealed === mines) {
      // Marcar todas las minas con banderas
      const winBoard = JSON.parse(JSON.stringify(currentBoard)) as CellState[][]
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (winBoard[r][c].hasMine) {
            winBoard[r][c].flagged = true
          }
        }
      }

      setBoard(winBoard)
      setMinesLeft(0)
      setGameState("won")

      // Actualizar mejor tiempo
      if (bestTimes[difficulty] === null || time < bestTimes[difficulty]!) {
        const newBestTimes = { ...bestTimes, [difficulty]: time }
        setBestTimes(newBestTimes)
        localStorage.setItem("minesweeperBestTimes", JSON.stringify(newBestTimes))
      }
    }
  }

  // Inicializar juego
  useEffect(() => {
    initializeBoard()

    // Cargar mejores tiempos desde localStorage
    try {
      const savedTimes = localStorage.getItem("minesweeperBestTimes")
      if (savedTimes) {
        setBestTimes(JSON.parse(savedTimes))
      }
    } catch (e) {
      console.error("Error loading best times", e)
    }
  }, [difficulty, initializeBoard])

  // Temporizador
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameState === "playing") {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState])

  // Función para manejar clic derecho (marcar bandera)
  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    toggleFlag(row, col)
  }

  // Función para manejar clic en celda revelada (revelar celdas adyacentes)
  const handleRevealAdjacent = (row: number, col: number) => {
    if (gameState !== "playing" || !board[row][col].revealed || board[row][col].adjacentMines === 0) return

    // Contar banderas adyacentes
    let adjacentFlags = 0
    for (let r = Math.max(0, row - 1); r <= Math.min(board.length - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(board[0].length - 1, col + 1); c++) {
        if (r === row && c === col) continue
        if (board[r][c].flagged) adjacentFlags++
      }
    }

    // Si el número de banderas adyacentes coincide con el número de minas adyacentes,
    // revelar todas las celdas adyacentes sin bandera
    if (adjacentFlags === board[row][col].adjacentMines) {
      for (let r = Math.max(0, row - 1); r <= Math.min(board.length - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(board[0].length - 1, col + 1); c++) {
          if (r === row && c === col) continue
          if (!board[r][c].flagged && !board[r][c].revealed) {
            revealCell(r, c)
          }
        }
      }
    }
  }

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Obtener color para el número de minas adyacentes
  const getMineColor = (count: number) => {
    switch (count) {
      case 1:
        return "text-blue-600"
      case 2:
        return "text-green-600"
      case 3:
        return "text-red-600"
      case 4:
        return "text-purple-800"
      case 5:
        return "text-orange-800"
      case 6:
        return "text-cyan-800"
      case 7:
        return "text-black"
      case 8:
        return "text-gray-600"
      default:
        return ""
    }
  }

  return (
    <div className="flex h-full flex-col bg-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Buscaminas</h2>

        <div className="flex space-x-2">
          <Button
            variant={difficulty === "principiante" ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficulty("principiante")}
            className={difficulty === "principiante" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Principiante
          </Button>
          <Button
            variant={difficulty === "intermedio" ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficulty("intermedio")}
            className={difficulty === "intermedio" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
          >
            Intermedio
          </Button>
          <Button
            variant={difficulty === "experto" ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficulty("experto")}
            className={difficulty === "experto" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Experto
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <Bomb className="h-5 w-5 text-red-600" />
          <span className="text-lg font-bold text-gray-800">{minesLeft}</span>
        </div>

        <Button variant="outline" size="sm" onClick={initializeBoard} className="border-gray-400 hover:bg-gray-300">
          <RefreshCw className="mr-1 h-4 w-4" />
          Reiniciar
        </Button>

        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-700" />
          <span className="text-lg font-bold text-gray-800">{formatTime(time)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="inline-block rounded-lg border-2 border-gray-300 bg-gray-200 p-2 shadow-md">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex h-8 w-8 items-center justify-center border border-gray-400 text-sm font-bold ${
                    cell.revealed ? (cell.hasMine ? "bg-red-500" : "bg-gray-100") : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() =>
                    cell.revealed ? handleRevealAdjacent(rowIndex, colIndex) : revealCell(rowIndex, colIndex)
                  }
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                  disabled={gameState === "lost" || gameState === "won"}
                >
                  {cell.flagged ? (
                    <Flag className="h-4 w-4 text-red-600" />
                  ) : cell.revealed ? (
                    cell.hasMine ? (
                      <Bomb className="h-5 w-5 text-black" />
                    ) : cell.adjacentMines > 0 ? (
                      <span className={`${getMineColor(cell.adjacentMines)}`}>{cell.adjacentMines}</span>
                    ) : null
                  ) : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje de victoria o derrota */}
      {gameState === "won" && (
        <div className="mt-4 rounded-lg bg-green-100 p-4 text-center text-green-800">
          <div className="mb-2 flex items-center justify-center">
            <Award className="mr-2 h-6 w-6 text-yellow-500" />
            <span className="text-lg font-bold">¡Felicidades! Has ganado</span>
          </div>
          <p>Tiempo: {formatTime(time)}</p>
          {bestTimes[difficulty] !== null && <p>Mejor tiempo: {formatTime(bestTimes[difficulty]!)}</p>}
        </div>
      )}

      {gameState === "lost" && (
        <div className="mt-4 rounded-lg bg-red-100 p-4 text-center text-red-800">
          <div className="mb-2 flex items-center justify-center">
            <Bomb className="mr-2 h-6 w-6 text-red-600" />
            <span className="text-lg font-bold">¡Boom! Has perdido</span>
          </div>
          <p>Inténtalo de nuevo</p>
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        <h3 className="mb-1 font-semibold">Instrucciones:</h3>
        <ul className="list-inside list-disc">
          <li>Clic izquierdo para revelar una celda</li>
          <li>Clic derecho para marcar/desmarcar una bandera</li>
          <li>Clic en un número revelado para revelar celdas adyacentes (si hay suficientes banderas)</li>
          <li>Encuentra todas las minas sin detonar ninguna</li>
        </ul>
      </div>
    </div>
  )
}
