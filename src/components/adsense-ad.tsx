'use client'

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
  return (
    <div className={`my-8 ${className}`} style={style}>
      {/* Google AdSense Responsive Ad Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
      
      {/* Fallback placeholder for development/testing */}
      <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
        <p className="text-muted-foreground font-medium">
          Google AdSense Responsive Ad
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Ad Slot: {adSlot}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Replace with your actual AdSense code
        </p>
      </div>
    </div>
  )
}
