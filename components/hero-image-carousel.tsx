"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const images = [
  {
    src: "/nith.jpg",
    alt: "Students celebrating placement success",
  },
  {
    src: "/nith1.webp",
    alt: "NIT Hamirpur campus placement drive",
  },
  {
    src: "/nith2.png",
    alt: "Students in professional settings",
  },
  {
    src: "/nith4.png",
    alt: "Students preparing for interviews",
  },
]

export default function HeroImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pixelateLevel, setPixelateLevel] = useState(1)
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map())

  // Preload images
  useEffect(() => {
    images.forEach((img) => {
      if (!imageCache.current.has(img.src)) {
        const image = new Image()
        image.src = img.src
        image.crossOrigin = "anonymous"
        image.onload = () => {
          imageCache.current.set(img.src, image)
        }
      }
    })
  }, [])

  // Set up canvas reference
  useEffect(() => {
    if (!canvasRef && containerRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = 500
      canvas.height = 500
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      canvas.style.objectFit = "cover"
      canvas.style.borderRadius = "0.5rem"
      canvas.style.position = "absolute"
      canvas.style.top = "0"
      canvas.style.left = "0"
      containerRef.current.appendChild(canvas)
      setCanvasRef(canvas)
    }

    return () => {
      if (canvasRef && containerRef.current) {
        containerRef.current.removeChild(canvasRef)
      }
    }
  }, [canvasRef])

  // Draw image with pixelation effect
  const drawPixelatedImage = (imageSrc: string, pixelSize: number) => {
    if (!canvasRef) return

    const ctx = canvasRef.getContext("2d")
    if (!ctx) return

    const cachedImage = imageCache.current.get(imageSrc)
    if (!cachedImage) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)

    if (pixelSize <= 1) {
      // Draw normal image when pixel size is 1 or less
      ctx.drawImage(cachedImage, 0, 0, canvasRef.width, canvasRef.height)
      return
    }

    // Draw pixelated image
    const w = canvasRef.width
    const h = canvasRef.height

    // Temporarily scale down
    ctx.drawImage(cachedImage, 0, 0, w / pixelSize, h / pixelSize)

    // Disable image smoothing for pixelated look
    ctx.imageSmoothingEnabled = false

    // Scale back up with pixelation
    ctx.drawImage(canvasRef, 0, 0, w / pixelSize, h / pixelSize, 0, 0, w, h)

    // Re-enable image smoothing
    ctx.imageSmoothingEnabled = true
  }

  // Update canvas when current image or pixelate level changes
  useEffect(() => {
    if (images[currentIndex]) {
      drawPixelatedImage(images[currentIndex].src, pixelateLevel)
    }
  }, [currentIndex, pixelateLevel])

  // Function to handle image transition
  const transitionToNextImage = () => {
    if (isTransitioning) return

    setIsTransitioning(true)

    // Start pixelate effect
    let pixelLevel = 1
    const pixelateInterval = setInterval(() => {
      pixelLevel = Math.min(pixelLevel + 1, 30)
      setPixelateLevel(pixelLevel)

      // When we reach max pixelation, switch images
      if (pixelLevel >= 30) {
        clearInterval(pixelateInterval)

        // Switch to next image
        setCurrentIndex(nextIndex)
        setNextIndex((nextIndex + 1) % images.length)

        // Start de-pixelate effect
        let dePixelLevel = 30
        const dePixelateInterval = setInterval(() => {
          dePixelLevel = Math.max(dePixelLevel - 1, 1)
          setPixelateLevel(dePixelLevel)

          if (dePixelLevel <= 1) {
            clearInterval(dePixelateInterval)
            setIsTransitioning(false)
          }
        }, 30)
      }
    }, 30)
  }

  // Set up automatic image rotation
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isTransitioning) {
        transitionToNextImage()
      }
    }, 5000) // Change image every 5 seconds

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentIndex, nextIndex, isTransitioning])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-lg overflow-hidden shadow-xl"
      style={{
        height: "500px",
        width: "500px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      {/* Fallback image (hidden when canvas is working) */}
      <div className={canvasRef ? "hidden" : ""}>
        <Image
          src={images[currentIndex].src || "/placeholder.svg"}
          alt={images[currentIndex].alt}
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-lg"
          priority
        />
      </div>

      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent mix-blend-overlay rounded-lg"></div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-animation"></div>

      {/* Image indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentIndex === index ? "bg-primary w-6 animate-pulse" : "bg-primary/40 hover:bg-primary/60",
            )}
            onClick={() => {
              if (!isTransitioning) {
                setNextIndex(index)
                transitionToNextImage()
              }
            }}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

