import { useState } from "react"

export function useEventNavigation(length: number) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + length) % length)
  }

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  return { current, direction, next, prev, goTo }
}
