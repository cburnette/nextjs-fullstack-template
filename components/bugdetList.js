import { useForm } from "react-hook-form"
import { PlusIcon } from '@heroicons/react/solid'
import Haikunator from 'haikunator'
import { mutate } from "swr"

export default function BudgetList() {
  const { handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async data => {
    const haikunator = new Haikunator()
    const budgetName = haikunator.haikunate()
    
    const res = await fetch(
      '/api/budgets',
      {
        body: JSON.stringify({
          name: budgetName
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    mutate('/api/budgets')
    reset()
  }

  return (
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-base font-medium text-gray-900">No budgets</h3>
      <p className="mt-1 text-base text-gray-500">Get started by creating a new budget.</p>
      <div className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Budget
          </button>
        </form>
      </div>
    </div>
  )
}
