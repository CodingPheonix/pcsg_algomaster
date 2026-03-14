'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const TutorialPage = () => {

    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    return (
        <div>
            this is the tutorial page for id: {id}
        </div>
    )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TutorialPage />
    </Suspense>
  );
}
