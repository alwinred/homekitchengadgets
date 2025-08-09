'use client'

interface HeroImageProps {
  src: string
  alt: string
  className?: string
}

export default function HeroImage({ src, alt, className }: HeroImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1024&h=1024&fit=crop&q=80'
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  )
}
