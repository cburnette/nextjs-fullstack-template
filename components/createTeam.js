import { mutate } from "swr"
import { useForm, Controller } from "react-hook-form"
import { useRamps } from './utils.js'
import NumberFormat from 'react-number-format'
import Link from 'next/link'
import currency from "currency.js"

export default function CreateTeam() {
  const { data, isLoading, isError } = useRamps()
  const { control, register, handleSubmit, reset, resetField, formState: { errors } } = useForm({defaultValues: {quota: ''}})

  const onSubmit = async data => {
    const res = await fetch(
      '/api/roles',
      {
        body: JSON.stringify({
          roleName: data.roleName,
          quota: currency(data.quota),
          rampModel: data.rampModel
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    mutate('/api/roles')
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-10 space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">Add a New Team</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter the name and details of the Sales Team you'd like to add.</p>
            </div>
            <div className="space-y-6 sm:space-y-5">
              
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Team Name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input {...register("roleName", {required: true})}
                    type="text"
                    name="roleName"
                    id="roleName"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.roleName && <span className="validation-error">Field is required</span>}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="quota" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Quota
                </label>
                <div className="mt-1 relative rounded-md sm:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  
                  <Controller
                    control={control}
                    name="quota"
                    className=""
                    {...register("quota", {required: true})}
                    render={({ field: { onChange, name, value } }) => (
                      <NumberFormat
                        thousandSeparator={true} 
                        decimalScale={0}
                        allowNegative={false}
                        isNumericString={true} 
                        className=" focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-6 pr-12 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                        name={name}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />

                  {errors.quota && <span className="validation-error">Field is required</span>}
                  {/* <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm" id="quota-currency">
                      USD
                    </span>
                  </div> */}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="rampModel" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Ramp Model
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  
                  {data && data.length === 0 && 
                    <Link href='/ramps'>
                      <a>
                        <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400">
                          Create a Ramp Model
                        </button>
                      </a>
                    </Link>
                  }

                  {data && data.length > 0 && 
                    <>
                      <select {...register("rampModel", {required: true})}
                        id="rampModel"
                        name="rampModel"
                        className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select one</option>
                        {data && data.map((item) => (
                          <option value={item.id} key={item.id}>{item.name}</option>
                        ))}
                      </select>
                      {errors.rampModel && <span className="validation-error">Field is required</span>} 
                    </>
                  }  
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