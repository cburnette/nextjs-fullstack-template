import { mutate } from "swr"
import { useForm } from "react-hook-form"
import { useRoles } from './utils.js'
import Link from 'next/link'

export default function CreateRep() {
  const { data, isLoading, isError } = useRoles()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async data => {
    const res = await fetch(
      '/api/reps',
      {
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    mutate('/api/reps')
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-10 space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">Add a New Rep</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter the name and details of the Sales Rep you'd like to add.</p>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  First name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input {...register("firstName", {required: true})}
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.firstName && <span className="validation-error">Field is required</span>}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Last name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input {...register("lastName", {required: true})}
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.lastName && <span className="validation-error">Field is required</span>}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Role
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  
                  {data && data.length === 0 && 
                    <Link href='/roles'>
                      <a>
                        <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400">
                          Create a Role
                        </button>
                      </a>
                    </Link>
                  }

                  {data && data.length > 0 && 
                    <>
                      <select {...register("role", {required: true})}
                        id="role"
                        name="role"
                        className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select one</option>
                        {data && data.map((item) => (
                          <option value={item.id} key={item.id}>{item.name}</option>
                        ))}
                      </select>
                      {errors.role && <span className="validation-error">Field is required</span>}
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