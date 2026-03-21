import React, { Suspense } from 'react'
import Client from './Client'
import { fetchAllSetProblemWithSolutionAndAnimations } from '../db/operations/problems'
import { Difficulty } from '../utils/type'

export type SetWithProblems = {
  id: string
  title: string
  problems: Problem[]
}

export type Problem = {
  id: string
  title: string
  link: string
  video: string | null
  difficulty: Difficulty
  hints: string[] | null
  descriptionId: string | null
  visualsId: string | null
  status: boolean
}

const allProblems = await fetchAllSetProblemWithSolutionAndAnimations() as SetWithProblems[]

const page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Client allProblems={allProblems} />
    </Suspense>
  )
}

export default page
