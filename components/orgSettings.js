import { mutate } from "swr"
import { useForm } from "react-hook-form"
import { useOrg } from './utils.js'
import { useState, useEffect } from 'react'

const months = [
  { name: 'January', id: 1 },
  { name: 'February', id: 2 },
  { name: 'March', id: 3 },
  { name: 'April', id: 4 },
  { name: 'May', id: 5 },
  { name: 'June', id: 6 },
  { name: 'July', id: 7 },
  { name: 'August', id: 8 },
  { name: 'September', id: 9 },
  { name: 'October', id: 10 },
  { name: 'November', id: 11 },
  { name: 'December', id: 12 }
]

const periods = [
  { name: 'Quarterly', id: 'quarter' },
  { name: 'Monthly', id: 'month' }
]

export default function OrgSettings() {
  const { data, isLoading, isError } = useOrg()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [fiscalYearStartMonth, setFiscalYearStartMonth] = useState(months[0])
  const [period, setPeriod] = useState(periods[0])

  function handleSelectChangeForFiscalYearStartMonth(event) {
    setFiscalYearStartMonth(event.target.value);
  }

  function handleSelectChangeForPeriod(event) {
    setPeriod(event.target.value);
  }

  const onSubmit = async data => {
    const res = await fetch(
      '/api/org',
      {
        body: JSON.stringify({
          fiscalYearStartMonth: fiscalYearStartMonth,
          period: period
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }
    )

    mutate('/api/org')
    reset()
  }

  //console.log(data)

  useEffect(() => {
    if (data) {
      setFiscalYearStartMonth(data.fiscalYearStartMonth)
      setPeriod(data.period)
    }
  }, [data]);

  if (isError) return (
    <div className="mx-10">An error has occurred</div>
  )
  if (isLoading) return (
    <div className="mx-10"><h1 className="text-xl text-gray-500 mt-5">Loading...</h1></div>
  )

  return (
    <>
      <div className="mx-10 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
        <label className="block text-base font-medium text-gray-700 sm:mt-px sm:pt-2">
          Your Organization Name
        </label>
        <div className="sm:mt-px sm:pt-2 sm:col-span-2 text-gray-500 font-mono">
            <div>{data.name}</div>
        </div>
      </div> 

      <form onSubmit={handleSubmit(onSubmit)} className="mx-10 space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">{'Time & Units'}</h3>
            </div>
            <div className="space-y-6 sm:space-y-5">

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="fiscalYearStartMonth" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Fiscal Year Start
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select {...register("fiscalYearStartMonth", {required: true})}
                      id="fiscalYearStartMonth"
                      name="fiscalYearStartMonth"
                      value={fiscalYearStartMonth} onChange={handleSelectChangeForFiscalYearStartMonth}
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      {months.map((item) => (
                        <option value={item.id} key={item.id} >{item.name}</option>
                      ))}
                    </select>
                    {errors.fiscalYearStartMonth && <span className="validation-error">Field is required</span>}
                </div>
              </div> 

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="fiscalYearStartMonth" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Period
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select {...register("period", {required: true})}
                      id="period"
                      name="period"
                      value={period} onChange={handleSelectChangeForPeriod}
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      {periods.map((item) => (
                        <option value={item.id} key={item.id} >{item.name}</option>
                      ))}
                    </select>
                    {errors.period && <span className="validation-error">Field is required</span>}
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