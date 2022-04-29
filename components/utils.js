import useSWR from "swr"

const fetcher = async url => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

export function useMe () {
  const { data, error } = useSWR('/api/me', fetcher)
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useOrg () {
  const { data, error } = useSWR('/api/org', fetcher)
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useReps () {
  const { data, error } = useSWR('/api/reps', fetcher)
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useRoles () {
  const { data, error } = useSWR('/api/roles', fetcher)
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useRamps () {
  const { data, error } = useSWR('/api/ramps', fetcher)
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  }
}