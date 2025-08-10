'use client'

import Script from 'next/script'

export function AdSenseScript() {
  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
