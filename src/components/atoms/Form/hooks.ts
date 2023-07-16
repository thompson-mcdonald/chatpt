import { createPlan } from "@/services/hasura"
import { useState } from "react"
import { generateSlug } from "random-word-slugs"

export interface TaskProps {
  name: string
  id: number
  sets: number
  reps?: number
  duration?: string
}

const useForm = () => {
  const [currentWeight, setCurrentWeight] = useState<number>(196)
  const [freeTime, setFreeTime] = useState<number>(60)
  const [currentLevel, setCurrentLevel] = useState<string>("average")
  const [caloriesIn, setCaloriesIn] = useState<number>(2000)
  const [calorieTarget, setCalorieTarget] = useState<number>(500)
  const [height, setHeight] = useState<number>(180)
  const [plan, setPlan] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const submitResponse = async () => {
    setIsLoading(true)
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({
        currentWeight,
        freeTime,
        currentLevel,
        caloriesIn,
        calorieTarget,
        height,
      }),
    })
    const result = await response.json()
    console.log(result)

    setPlan(JSON.parse(result.result.content))
    setIsLoading(false)

    await submitWorkoutPlan()
  }

  const submitWorkoutPlan = async () => {
    const uuid = self.crypto.randomUUID()
    const slug = generateSlug()
    console.log(uuid, slug)

    const response = await createPlan(
      caloriesIn,
      calorieTarget,
      freeTime,
      JSON.stringify(plan),
      plan?.summary,
      currentWeight,
      uuid,
      `/${slug}`
    )

    console.log(response)

    return response
  }

  return {
    currentWeight,
    setCurrentWeight,
    freeTime,
    setFreeTime,
    currentLevel,
    setCurrentLevel,
    caloriesIn,
    setCaloriesIn,
    calorieTarget,
    setCalorieTarget,
    submitResponse,
    plan,
    isLoading,
  }
}

export default useForm
