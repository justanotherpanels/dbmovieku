'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import posthog from 'posthog-js'

function PostHogPageviewContents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  // Scroll Tracking
  useEffect(() => {
    let maxScroll = 0
    const handleScroll = () => {
      const scrollY = window.scrollY
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      
      const currentScrollPercent = Math.min(100, Math.round((scrollY / totalHeight) * 100))
      
      // We track maximum scroll depth reached on the page
      if (currentScrollPercent > maxScroll) {
        maxScroll = currentScrollPercent
      }
    }

    // Capture scroll depth when leaving the page or every 25% threshold
    const trackedThresholds = new Set()
    const checkThresholds = () => {
      const scrollY = window.scrollY
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const currentScrollPercent = Math.min(100, Math.round((scrollY / totalHeight) * 100))

      const thresholds = [25, 50, 75, 90, 100]
      thresholds.forEach(t => {
        if (currentScrollPercent >= t && !trackedThresholds.has(t)) {
          trackedThresholds.add(t)
          posthog.capture('scroll_depth', {
            percent: t,
            pathname: pathname
          })
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', checkThresholds)

    return () => {
      // Capture max scroll depth upon leaving
      if (maxScroll > 0) {
        posthog.capture('max_scroll_depth', {
          max_percent: maxScroll,
          pathname: pathname
        })
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', checkThresholds)
    }
  }, [pathname])

  return null
}

export default function PostHogPageview() {
  return (
    <Suspense fallback={null}>
      <PostHogPageviewContents />
    </Suspense>
  )
}
