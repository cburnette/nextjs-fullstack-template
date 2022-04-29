import { mutate } from "swr"
import { useForm } from "react-hook-form"

export default function CreateRamp() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async data => {
    const res = await fetch(
      '/api/ramps',
      {
        body: JSON.stringify({
          rampName: data.rampName,
          achievementFactor: data.achievementFactor,
          monthlyQuota: [data.m1,data.m2,data.m3,data.m4,data.m5,data.m6,data.m7,data.m8,data.m9,data.m10,data.m11,data.m12]
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    mutate('/api/ramps')
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-10 space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">Add a New Ramp Model</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter the name and details of the Ramp Model you'd like to add.</p>
            </div>
            <div className="space-y-6 sm:space-y-5">

              <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="rampName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input {...register("rampName", {required: true})}
                    type="text"
                    name="rampName"
                    id="rampName"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.rampName && <span className="validation-error">Field is required</span>}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="achievementFactor" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Achievement Factor %
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input {...register("achievementFactor", {required: true, min: 0, max: 100})}
                    type="number"
                    name="achievementFactor"
                    id="achievementFactor"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.achievementFactor && <span className="validation-error">Must be between 0 and 100 percent</span>}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="quota" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Monthly Quota %
                </label>
                <div className="flex flex-row sm:col-span-3">
                  {[...Array(12)].map((_, i) =>
                    <div className="mr-2 mt-1 sm:mt-0" key={i}>
                      <input {...register(`m${i+1}`, {required: true, min: 0, max: 100})}
                        type="number"
                        name={`m${i+1}`}
                        id={`m${i+1}`}
                        className="w-14 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                      />
                      <div className="text-sm text-center">{i+1}</div>
                      {errors[`m${i+1}`] && <div className="validation-error text-center text-xs">Required</div>}
                    </div>
                  )}
                  
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  )
}