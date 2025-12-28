"use client"

import { useState, useEffect, useRef } from "react"
import { Joystick } from "./joystick"

export function LoadingScreen({ idea, onCoinsCollected }: { idea: string; onCoinsCollected: (coins: number) => void }) {
  const [scannerY, setScannerY] = useState(0)
  const [dots, setDots] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [lines, setLines] = useState<string[]>([])
  const [charX, setCharX] = useState(50)
  const [charY, setCharY] = useState(50)
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({})
  const [showHint, setShowHint] = useState(true)
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [collectedCoins, setCollectedCoins] = useState(0)
  const [nextCoinId, setNextCoinId] = useState(0)
  const collectedCoinIds = useRef<Set<number>>(new Set())
  const joystickRef = useRef({ x: 0, y: 0 })

  // Reset collected coin IDs when component mounts or idea changes
  useEffect(() => {
    collectedCoinIds.current.clear()
    setCollectedCoins(0)
  }, [idea])

  // Animate scanner line
  useEffect(() => {
    const interval = setInterval(() => {
      setScannerY((prev) => (prev + 2) % 100)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Typewriter effect for input text
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < idea.length) {
        setDisplayText(idea.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [idea])

  // Terminal output lines
  useEffect(() => {
    const outputLines = [
      "$ INITIALIZING_ROAST_ENGINE...",
      "$ LOADING_BRUTAL_DATABASE...",
      "$ PARSING_STARTUP_CONCEPTS...",
      "$ ACTIVATING_TRUTH_SERUM...",
      "$ GENERATING_WITTY_INSULTS...",
      "$ CALIBRATING_SADNESS_DETECTOR...",
    ]

    let currentLine = 0
    const timeout = setInterval(() => {
      if (currentLine < outputLines.length) {
        setLines((prev) => [...prev, outputLines[currentLine]])
        currentLine++
      }
    }, 400)

    return () => clearInterval(timeout)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (["W", "A", "S", "D"].includes(key)) {
        setKeysPressed((prev) => ({ ...prev, [key]: true }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (["W", "A", "S", "D"].includes(key)) {
        setKeysPressed((prev) => ({ ...prev, [key]: false }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCharX((prev) => {
        let dx = 0
        if (keysPressed["A"]) dx -= 3
        if (keysPressed["D"]) dx += 3

        // Add joystick input (scaled by speed)
        dx += joystickRef.current.x * 3

        return Math.max(0, Math.min(100, prev + dx))
      })

      setCharY((prev) => {
        let dy = 0
        if (keysPressed["W"]) dy -= 3
        if (keysPressed["S"]) dy += 3

        // Add joystick input
        dy += joystickRef.current.y * 3

        return Math.max(0, Math.min(100, prev + dy))
      })
    }, 30)

    return () => clearInterval(moveInterval)
  }, [keysPressed])

  const handleJoystickMove = (x: number, y: number) => {
    joystickRef.current = { x, y }
  }

  useEffect(() => {
    const hintTimeout = setTimeout(() => {
      setShowHint(false)
    }, 5000)

    return () => clearTimeout(hintTimeout)
  }, [])

  useEffect(() => {
    const coinInterval = setInterval(() => {
      const newCoin = {
        id: nextCoinId,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
      }
      setCoins((prev) => [...prev, newCoin])
      setNextCoinId((prev) => prev + 1)
    }, 800)

    return () => clearInterval(coinInterval)
  }, [nextCoinId])

  useEffect(() => {
    setCoins((prevCoins) => {
      let coinsToCollect = 0
      const remaining = prevCoins.filter((coin) => {
        // Skip if this coin was already collected
        if (collectedCoinIds.current.has(coin.id)) {
          return false // Already collected, remove it
        }

        const distance = Math.sqrt(Math.pow(coin.x - charX, 2) + Math.pow(coin.y - charY, 2))
        if (distance < 8) {
          // Mark this coin as collected
          collectedCoinIds.current.add(coin.id)
          coinsToCollect++
          return false // Remove the coin
        }
        return true // Keep the coin
      })
      // Only increment once for all NEW coins collected in this frame
      if (coinsToCollect > 0) {
        setCollectedCoins((prev) => prev + coinsToCollect)
      }
      return remaining
    })
  }, [charX, charY])

  // Notify parent whenever collectedCoins changes (no timeout - parent controls when to finish)
  useEffect(() => {
    onCoinsCollected(collectedCoins)
  }, [collectedCoins, onCoinsCollected])

  const dotString = ".".repeat(dots)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-300">
      {/* Terminal Header */}
      <div className="border-b border-green-400 pb-8 space-y-2">
        <div className="text-green-400 text-sm opacity-75">$ startup_evaluator --mode=analysis</div>
        <h1 className="text-4xl font-bold tracking-tight text-green-400 font-mono">ANALYZING YOUR FATE{dotString}</h1>
        <div className="text-green-300 text-sm font-mono pt-2">$ coins_collected: {collectedCoins}</div>
      </div>

      {/* Scanner effect with interactive character */}
      <div className="relative border-2 border-green-400 h-48 bg-black overflow-hidden">
        <div
          className="absolute inset-x-0 h-1 bg-green-400 opacity-75 shadow-lg shadow-green-400"
          style={{
            top: `${scannerY}%`,
            transition: "none",
          }}
        />
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300"
            style={{
              left: `${coin.x}%`,
              top: `${coin.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
        <div
          className="absolute w-8 h-8 transition-all duration-75"
          style={{
            left: `${charX}%`,
            top: `${charY}%`,
            transform: "translate(-50%, -50%)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' y='0' width='8' height='4' fill='%2322c55e'/%3E%3Crect x='2' y='4' width='12' height='4' fill='%2322c55e'/%3E%3Crect x='4' y='8' width='2' height='4' fill='%2322c55e'/%3E%3Crect x='10' y='8' width='2' height='4' fill='%2322c55e'/%3E%3Crect x='5' y='12' width='6' height='4' fill='%2322c55e'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            imageRendering: "pixelated",
          }}
        />
        {showHint && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 animate-out fade-out duration-1000 delay-4000 pointer-events-none">
            <div className="text-green-400 text-xs font-mono px-2 py-1 border border-green-400 bg-black whitespace-nowrap">
              {isMobile ? "use joystick to move and collect coins" : "use WASD to move and collect coins"}
            </div>
          </div>
        )}
        <div className="p-4 space-y-2 font-mono text-xs text-green-400 h-full overflow-hidden">
          {lines.map((line, idx) => (
            <div key={idx} className="animate-in fade-in">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Joystick - Moved to middle */}
      {isMobile && (
        <div className="flex flex-col items-center gap-2 py-4">
          <Joystick onMove={handleJoystickMove} size={120} />
          <p className="text-green-300 text-xs font-mono opacity-50">
            $ use joystick to move entity
          </p>
        </div>
      )}

      {/* Your idea being processed */}
      <div className="border-2 border-green-400 bg-black p-6 font-mono text-sm space-y-2">
        <div className="text-green-500">{">> [PROCESSING_INPUT]"}</div>
        <div className="text-green-400 min-h-24">
          {displayText}
          <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
        </div>
      </div>

      {/* Processing status */}
      <div className="flex items-center justify-between font-mono text-sm">
        <div className="text-green-300">$ scanning_database</div>
        <div className="text-green-400">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
          loading
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-2 border-green-400 h-6 bg-black relative overflow-hidden">
        <div
          className="h-full bg-green-400 transition-all duration-500"
          style={{
            width: `${Math.min(70 + lines.length * 10, 95)}%`,
          }}
        />
      </div>

      <div className="border-t border-green-400 pt-6 text-center space-y-4">


        {/* Desktop Instructions - Hidden on small screens */}
        {!isMobile && (
          <p className="text-green-300 text-xs font-mono opacity-50 mb-2">
            $ press WASD to move entity and collect coins
          </p>
        )}

        <p className="text-green-300 text-xs font-mono opacity-75">$ processing{dotString} do not close_window</p>
      </div>
    </div>
  )
}