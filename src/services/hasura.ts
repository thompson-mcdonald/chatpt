import { createClient } from "graphqurl"

export const client = createClient({
  endpoint: process.env.NEXT_PUBLIC_HASURA_GQL_ENDPOINT || "",
})

const createPlanMutation = `mutation PlanCreationMutation($slug: String, $summary: String, $uuid: String, $freeTime: Int, $currentWeight: Int, $caloriesIn: Int, $calorieTarget: Int, $plan: jsonb) {
  insert_plans(objects: {calorieTarget: $calorieTarget, caloriesIn: $caloriesIn, currentWeight: $currentWeight, freeTime: $freeTime, plan: $plan, slug: $slug, summary: $summary, uuid: $uuid}) {
    returning {
      id
    }
  }
}
`

export const createPlan = async (
  caloriesIn: number,
  calorieTarget: number,
  freeTime: number,
  plan: any,
  summary: string,
  currentWeight: number,
  uuid: string,
  slug: string
) => {
  const response = await client.query({
    query: createPlanMutation,
    variables: {
      caloriesIn,
      calorieTarget,
      freeTime,
      plan,
      summary,
      currentWeight,
      uuid,
      slug,
    },
    headers: {
      "x-hasura-admin-secret": `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET}`,
      "content-type": "text/json",
    },
  })

  return response.data.insert_plans.returning
}
