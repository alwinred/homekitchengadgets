'use client'

import { useEffect, useState } from 'react'

interface AdSenseAdProps {
  className?: string
  adSlot?: string
  adFormat?: 'auto' | 'fluid'
  style?: React.CSSProperties
}

export function AdSenseAd({ 
  className = '', 
  adSlot = 'your-ad-slot-id',
  adFormat = 'auto',
  style = {}
}: AdSenseAdProps) {
  const [isDevelopment, setIsDevelopment] = useState(false)
  const [adSenseLoaded, setAdSenseLoaded] = useState(false)

  useEffect(() => {
    // Check if we're in development mode
    setIsDevelopment(process.env.NODE_ENV === 'development')
    
    // Only run AdSense in production and if we have a real publisher ID
    if (typeof window !== 'undefined' && 
        process.env.NODE_ENV === 'production' && 
        window.adsbygoogle &&
        process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID &&
        process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID !== 'ca-pub-YOUR_PUBLISHER_ID') {
      try {
        setAdSenseLoaded(true)
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adSlot]);

  // Show development placeholder
  if (isDevelopment || !adSenseLoaded) {
    return (
      <div className={`my-8 ${className}`} style={style}>
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
          <p className="text-muted-foreground font-medium">
            Google AdSense Responsive Ad
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Ad Slot: {adSlot}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isDevelopment 
              ? 'AdSense disabled in development mode' 
              : 'Replace with your actual AdSense code'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`my-8 ${className}`} style={style}>
      {/* Google AdSense Responsive Ad Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-YOUR_PUBLISHER_ID'}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}
