import React, { Suspense } from 'react'
import Client from './Client'
import { fetchAllSetProblemWithSolutionAndAnimations } from '../db/operations/problems'
import { Difficulty } from '../utils/type'
import { verifySession } from '../lib/dal'

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


const page = async () => {
  const isVerified = await verifySession().then((res) => res.isAuth)
  const allProblems = await fetchAllSetProblemWithSolutionAndAnimations() as SetWithProblems[]

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Client allProblems={allProblems} isVerified={isVerified} />
    </Suspense>
  )
}

export default page
