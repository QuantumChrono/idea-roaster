"use client"

import { useState, useRef, useEffect } from "react"

interface JoystickProps {
    onMove: (x: number, y: number) => void
    size?: number
    baseColor?: string
    stickColor?: string
}

export function Joystick({
    onMove,
    size = 100,
    baseColor = "rgba(34, 197, 94, 0.2)",
    stickColor = "rgba(34, 197, 94, 0.8)"
}: JoystickProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [active, setActive] = useState(false)
    const touchId = useRef<number | null>(null)

    const handleStart = (clientX: number, clientY: number) => {
        setActive(true)
        updatePosition(clientX, clientY)
    }

    const handleMove = (clientX: number, clientY: number) => {
        if (active) {
            updatePosition(clientX, clientY)
        }
    }

    const handleEnd = () => {
        setActive(false)
        setPosition({ x: 0, y: 0 })
        onMove(0, 0)
        touchId.current = null
    }

    const updatePosition = (clientX: number, clientY: number) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = clientX - centerX
        const dy = clientY - centerY

        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = size / 2

        let x = dx
        let y = dy

        if (distance > maxDistance) {
            const ratio = maxDistance / distance
            x = dx * ratio
            y = dy * ratio
        }

        setPosition({ x, y })

        // Normalize to -1 to 1
        onMove(x / maxDistance, y / maxDistance)
    }

    // Touch handlers
    const onTouchStart = (e: React.TouchEvent) => {
        e.preventDefault() // Prevent scrolling
        const touch = e.changedTouches[0]
        touchId.current = touch.identifier
        handleStart(touch.clientX, touch.clientY)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        e.preventDefault()
        if (touchId.current !== null) {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId.current)
            if (touch) {
                handleMove(touch.clientX, touch.clientY)
            }
        }
    }

    const onTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault()
        if (touchId.current !== null) {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId.current)
            if (touch) {
                handleEnd()
            }
        }
    }

    // Mouse fallback for testing on desktop if needed, though strictly requested for phone users
    // keeping it mostly for logic verification if desktop has touch simulation

    return (
        <div
            ref={containerRef}
            className={`relative rounded-full select-none touch-none ${active ? 'opacity-100' : 'opacity-50'} transition-opacity`}
            style={{
                width: size,
                height: size,
                backgroundColor: baseColor,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
        >
            <div
                className="absolute rounded-full shadow-lg"
                style={{
                    width: size / 2,
                    height: size / 2,
                    backgroundColor: stickColor,
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                    transition: active ? 'none' : 'transform 0.1s ease-out'
                }}
            />
        </div>
    )
}
