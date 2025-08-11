'use client'

import Script from 'next/script'

export function AdSenseScript() {
  // Only load AdSense script in production and if we have a real publisher ID
  if (process.env.NODE_ENV !== 'production' || 
      !process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
      process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID === 'ca-pub-YOUR_PUBLISHER_ID') {
    return null
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
