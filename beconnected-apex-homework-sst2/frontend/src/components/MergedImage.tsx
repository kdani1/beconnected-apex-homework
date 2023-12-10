import React, { useRef, useState, useEffect } from 'react'
import { Box, Image } from '@chakra-ui/react'

type Props = {
  backImage: string
  frontImage: string
}

export const MergedImage: React.FC<Props> = ({ backImage, frontImage }) => {
  const imageSize = '40%' // 1/8th of the back image
  const backImageRef = useRef<HTMLImageElement>(null)
  const frontImageRef = useRef<HTMLImageElement>(null)

  const [position, setPosition] = useState({ x: 3, y: 3 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setStartPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isDragging) {
      const offsetX = e.clientX - startPosition.x
      const offsetY = e.clientY - startPosition.y

      const newX = Math.min(
        Math.max(0, position.x + offsetX),
        (backImageRef.current?.offsetWidth || 0) -
          (frontImageRef.current?.offsetWidth || 0)
      )

      const newY = Math.min(
        Math.max(0, position.y + offsetY),
        (backImageRef.current?.offsetHeight || 0) -
          (frontImageRef.current?.offsetHeight || 0)
      )

      setPosition({ x: newX, y: newY })
      setStartPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    // Move back dynamically over a period of 1 second
    const initialPosition = { x: position.x, y: position.y }
    const startTime = Date.now()

    const moveBack = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      if (elapsedTime < 1000) {
        const progress = elapsedTime / 1000
        const newX = initialPosition.x + (3 - initialPosition.x) * progress
        const newY = initialPosition.y + (3 - initialPosition.y) * progress
        setPosition({ x: newX, y: newY })
        requestAnimationFrame(moveBack)
      } else {
        setPosition({ x: 3, y: 3 })
      }
    }

    requestAnimationFrame(moveBack)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    setIsDragging(true)
    setStartPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (isDragging) {
      const offsetX = e.touches[0].clientX - startPosition.x
      const offsetY = e.touches[0].clientY - startPosition.y

      const newX = Math.min(
        Math.max(0, position.x + offsetX),
        (backImageRef.current?.offsetWidth || 0) -
          (frontImageRef.current?.offsetWidth || 0)
      )

      const newY = Math.min(
        Math.max(0, position.y + offsetY),
        (backImageRef.current?.offsetHeight || 0) -
          (frontImageRef.current?.offsetHeight || 0)
      )

      setPosition({ x: newX, y: newY })
      setStartPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    // Move back dynamically over a period of 1 second
    const initialPosition = { x: position.x, y: position.y }
    const startTime = Date.now()

    const moveBack = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      if (elapsedTime < 300) {
        const progress = elapsedTime / 300
        const newX = initialPosition.x + (3 - initialPosition.x) * progress
        const newY = initialPosition.y + (3 - initialPosition.y) * progress
        setPosition({ x: newX, y: newY })
        requestAnimationFrame(moveBack)
      } else {
        setPosition({ x: 3, y: 3 })
      }
    }

    requestAnimationFrame(moveBack)
  }

  const handleFrontImageClick = () => {
    if (backImageRef.current && frontImageRef.current) {
      const tempSrc = backImageRef.current.src
      backImageRef.current.src = frontImageRef.current.src
      frontImageRef.current.src = tempSrc
    }
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isDragging) {
        e.preventDefault()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging])

  return (
    <Box position="relative" className="mergedImageHolder">
      {/* Back image */}
      <Image
        ref={backImageRef}
        src={backImage}
        borderRadius={'3xl'}
        maxHeight={'75vh'}
        borderColor={'black'}
        borderWidth={'1px'}
        borderStyle={'solid'}
      />

      {/* Conditionally render the front image */}
      {frontImage && (
        <Image
          ref={frontImageRef}
          src={frontImage}
          borderRadius={'3xl'}
          maxHeight={'75vh'}
          borderColor={'black'}
          borderWidth={'1px'}
          borderStyle={'solid'}
          position="absolute"
          top={`${position.y}px`}
          left={`${position.x}px`}
          width={imageSize}
          height={imageSize}
          objectFit="contain"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleFrontImageClick}
        />
      )}
    </Box>
  )
}
