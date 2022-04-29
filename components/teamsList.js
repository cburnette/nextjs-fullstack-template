import { useRoles } from './utils.js'
import currency from 'currency.js'

export default function TeamsList() {
  const { data, isLoading, isError } = useRoles()

  if (isError) return (
    <div className="mx-10">An error has occurred</div>
  )
  if (isLoading) return (
    <div className="mx-10"><h1 className="text-xl text-gray-500 mt-5">Loading...</h1></div>
  )
  if (data) return (
    <div className="mx-10">
      <h1 className="text-xl mt-5">Sales Teams</h1>
      <div className="mt-3 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>   
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ramp Model
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quota
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, itemIdx) => (
                    <tr key={item.id} className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rampModel.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{currency(item.quota, { precision: 0 }).format()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.length === 0 && 
              <div className='mt-5 text-center text-gray-400'>You don't have any Teams yet.</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
