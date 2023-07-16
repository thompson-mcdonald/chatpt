import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    })
    return
  }

  const {
    currentWeight,
    height,
    freeTime,
    currentLevel,
    caloriesIn,
    calorieTarget,
  } = JSON.parse(req.body) || []
  try {
    const prompt = generatePrompt(
      currentWeight,
      height,
      currentLevel,
      calorieTarget,
      freeTime
    )
    const msg = generateMessage("user", prompt)
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      temperature: 0.7,
      messages: [msg],
      max_tokens: 2000,
    })
    console.log(completion)
    const result = completion.data.choices[0].message

    console.log(completion)

    res.status(200).json({
      result: result,
      message: prompt,
    })
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      })
    }
  }
}

export function generateMessage(
  role: "user" | "system" | "assistant",
  content: string
) {
  return {
    role,
    content,
  }
}

export function generatePrompt(
  currentWeight?: number,
  height?: number,
  currentLevel?: string,
  calorieTarget?: number,
  freetime?: number
) {
  return `
  For someone with a weight of ${currentWeight} lbs (${height} cm tall), no equipment, limited space, a currently ${currentLevel} fitness level, ${freetime} minutes free time per day, and a daily calorie-burn goal of ${calorieTarget} calories, write a workout plan for 1 week. Do not add equipment, focus on body-weight only. 

Respond with valid JSON data only, compress and do not include newlines. Return a structure similar to the following, with an array containing 7 days of workouts:

{
    "summary": "This plan...",
	"days": [{
		"id": "0",
		"tasks": [
			{ name: "Crunches", id: 1, reps: 10, sets: 2 },
            { name: "Plank", id: 2, duration: "30 seconds", sets: 2 },
            { name: "Russian Twist", id: 3, reps: 20, sets: 3, side: "left" },
            { name: "Russian Twist", id: 4, reps: 20, sets: 3, side: "right" },
		]
	}   
]`
}
