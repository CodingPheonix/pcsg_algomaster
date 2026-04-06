'use client'

import ArrayAnimators from '@/app/components/animators/ArrayAnimators'
import { useSearchParams } from 'next/navigation'
import { VisualizerAction } from '../../visual/create/tools'
import { fetchProblemVisuals, insertProblemVisuals } from '@/app/db/operations/problemVisuals'
import { Suspense, useEffect, useState } from 'react'

const TOPIC = "Problem"

type ArrayAnimationProps = {
  problemId: string;
  code: string;
  algoSteps: VisualizerAction[];
  arrayInput: string;
}

const Animation = () => {

  const [ArrayVisualizerData, setArrayVisualizerData] = useState<ArrayAnimationProps>({
    problemId: "",
    code: "",
    algoSteps: [],
    arrayInput: ""
  })

  const searchParams = useSearchParams()
  const problemId = searchParams.get('id') as string;

  const handleSubmit = async (problemId: string, code: string, algoSteps: VisualizerAction[], arrayInput: string) => {
    await insertProblemVisuals({problemId, codeText: code, codeSteps: algoSteps, inputArray: arrayInput})
  }

  useEffect(() => {
    if (!problemId) return;

    const fetchData = async () => {
      const [arrayData] = await Promise.all([fetchProblemVisuals(problemId)])

      arrayData && setArrayVisualizerData({
        problemId: problemId, 
        code: arrayData?.codeText as string, 
        algoSteps: JSON.parse(arrayData?.codeSteps as string) as VisualizerAction[], 
        arrayInput: arrayData?.inputArray as string
      });
    }
    fetchData();
  }, [problemId])

  return (
    <div>
      <ArrayAnimators topic={TOPIC} onSubmit={handleSubmit} problemId={problemId} prevData={{codetext: ArrayVisualizerData.code, inputArray: ArrayVisualizerData.arrayInput, actionSteps: ArrayVisualizerData.algoSteps}} />
    </div>
  )
}

const page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Animation />
    </Suspense>
  )
}

export default page
