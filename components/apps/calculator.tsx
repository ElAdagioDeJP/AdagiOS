"use client"

import { useState } from "react"
import { Divide, Minus, Plus, SquareDivideIcon as Multiply, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation()
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null || operator === null) {
      return inputValue
    }

    let result = 0
    switch (operator) {
      case "+":
        result = firstOperand + inputValue
        break
      case "-":
        result = firstOperand - inputValue
        break
      case "*":
        result = firstOperand * inputValue
        break
      case "/":
        result = firstOperand / inputValue
        break
      case "%":
        result = firstOperand % inputValue
        break
      default:
        return inputValue
    }

    return result
  }

  const handleEquals = () => {
    if (firstOperand === null || operator === null) {
      return
    }

    const result = performCalculation()
    setDisplay(String(result))
    setFirstOperand(result)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handlePercentage = () => {
    const inputValue = Number.parseFloat(display)
    const result = inputValue / 100
    setDisplay(String(result))
  }

  const handleToggleSign = () => {
    const inputValue = Number.parseFloat(display)
    setDisplay(String(-1 * inputValue))
  }

  return (
    <div className="flex h-full flex-col bg-gray-900 p-4">
      {/* Display */}
      <div className="mb-4 flex h-20 items-end justify-end rounded-lg bg-gray-800 p-4">
        <div className="text-right font-mono text-3xl text-white">{display}</div>
      </div>

      {/* Keypad */}
      <div className="grid flex-1 grid-cols-4 gap-2">
        {/* Row 1 */}
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-700 text-lg font-medium text-white hover:bg-gray-600"
          onClick={clearDisplay}
        >
          C
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-700 text-lg font-medium text-white hover:bg-gray-600"
          onClick={handleToggleSign}
        >
          +/-
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-700 text-lg font-medium text-white hover:bg-gray-600"
          onClick={handlePercentage}
        >
          <Percent className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-orange-600 text-lg font-medium text-white hover:bg-orange-500"
          onClick={() => handleOperator("/")}
        >
          <Divide className="h-5 w-5" />
        </Button>

        {/* Row 2 */}
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("7")}
        >
          7
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("8")}
        >
          8
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("9")}
        >
          9
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-orange-600 text-lg font-medium text-white hover:bg-orange-500"
          onClick={() => handleOperator("*")}
        >
          <Multiply className="h-5 w-5" />
        </Button>

        {/* Row 3 */}
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("4")}
        >
          4
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("5")}
        >
          5
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("6")}
        >
          6
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-orange-600 text-lg font-medium text-white hover:bg-orange-500"
          onClick={() => handleOperator("-")}
        >
          <Minus className="h-5 w-5" />
        </Button>

        {/* Row 4 */}
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("1")}
        >
          1
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("2")}
        >
          2
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("3")}
        >
          3
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-orange-600 text-lg font-medium text-white hover:bg-orange-500"
          onClick={() => handleOperator("+")}
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Row 5 */}
        <Button
          variant="ghost"
          className="col-span-2 rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={() => inputDigit("0")}
        >
          0
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-gray-800 text-lg font-medium text-white hover:bg-gray-700"
          onClick={inputDecimal}
        >
          .
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg bg-emerald-600 text-lg font-medium text-white hover:bg-emerald-500"
          onClick={handleEquals}
        >
          =
        </Button>
      </div>
    </div>
  )
}
