import { useEffect, useState } from 'react'

type UseHeroTypingParams = {
  text: string
  speed?: number
}

export const useHeroTyping = ({ text, speed = 70 }: UseHeroTypingParams) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let index = 0

    const timer = window.setInterval(() => {
      index += 1
      setDisplayedText(text.slice(0, index))

      if (index >= text.length) {
        window.clearInterval(timer)
      }
    }, speed)

    return () => window.clearInterval(timer)
  }, [text, speed])

  return displayedText
}