'use client'

import { Suspense } from 'react'
import VisitContent from './VisitContent'

export default function VisitPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <VisitContent />
    </Suspense>
  )
}
