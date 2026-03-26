'use client'

import { useReportWebVitals } from 'next/web-vitals'
import posthog from 'posthog-js'

export function WebVitals() {
  useReportWebVitals((metric) => {
    posthog.capture('$web_vitals', {
      event_label: metric.name,
      value: metric.value,
      label: metric.id, // id unique to current page load
      path: window.location.pathname,
    })
  })

  return null
}
