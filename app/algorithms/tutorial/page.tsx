'use client'

import { useSearchParams } from 'next/navigation'

const page = () => {

    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    return (
        <div>
            this is the tutorial page for id: {id}
        </div>
    )
}

export default page
