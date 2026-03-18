'use client'

import ArrayAnimators from '@/app/components/animators/ArrayAnimators'
import { useSearchParams } from 'next/navigation'
import { VisualizerAction } from '../../visual/create/tools'
import { fetchProblemVisuals, insertProblemVisuals } from '@/app/db/operations/problemVisuals'
import { useEffect, useState } from 'react'

const TOPIC = "Problem"

type ArrayAnimationProps = {
  problemId: string;
  code: string;
  algoSteps: VisualizerAction[];
  arrayInput: string;
}

const page = () => {

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

      arrayData && setArrayVisualizerData({problemId: problemId, code: arrayData[0]?.codeText, algoSteps: arrayData[0]?.codeSteps, arrayInput: arrayData[0]?.inputArray});
    }
    fetchData();
  }, [problemId])

  return (
    <div>
      <ArrayAnimators topic={TOPIC} onSubmit={handleSubmit} problemId={problemId} prevData={{codetext: ArrayVisualizerData.code, inputArray: ArrayVisualizerData.arrayInput, actionSteps: ArrayVisualizerData.algoSteps}} />
    </div>
  )
}

export default page
