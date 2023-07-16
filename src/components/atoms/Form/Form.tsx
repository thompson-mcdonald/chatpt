import { ReactNode } from "react"
import styles from "./Form.module.css"
import useForm from "./hooks"

export interface FormProps {
  children?: ReactNode
}

export default function Form(props: FormProps) {
  const {
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
    plan,
    submitResponse,
    isLoading,
  } = useForm()

  console.log(plan)

  return (
    <div className={styles.base}>
      {!isLoading ? (
        <form
          onSubmit={(e) => {
            e.preventDefault(), submitResponse()
          }}
        >
          <div>
            <label htmlFor="weight">Current Weight (pounds)</label>
            <input
              type="number"
              id="weight"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="weight">Current Level of Physical Activity</label>
            <select
              name="current-level"
              id=""
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="average">Average</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label htmlFor="free-time">Free time per day (minutes)</label>
            <input
              type="number"
              id="free-time"
              value={freeTime}
              onChange={(e) => setFreeTime(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="calories-in">Calories In per day</label>
            <input
              type="number"
              id="calories-in"
              value={caloriesIn}
              onChange={(e) => setCaloriesIn(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="calorie-target">Calorie burn target per day</label>
            <input
              type="number"
              id="calorie-target"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(Number(e.target.value))}
            />
          </div>
          <input type="submit" value="Submit" />
        </form>
      ) : (
        "Loading rn..."
      )}
      <>
        {plan && !isLoading ? (
          <>
            {plan.summary}
            {plan.days?.map((item, index) => {
              return (
                <div key={item.id}>
                  Day {Number(item.id) + 1}
                  {item.tasks.map((set) => {
                    return (
                      <div key={set.id}>
                        {set.name} - {set.reps ? set.reps : `${set.duration}`}{" "}
                        for {set.sets} sets
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </>
        ) : (
          ""
        )}
      </>
    </div>
  )
}
