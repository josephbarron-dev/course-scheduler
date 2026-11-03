// Feature: Custom useFetch hook (data, isPending, error)
import { useState, useEffect } from 'react'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsPending(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Could not fetch data (HTTP ${res.status})`)
        return res.json()
      })
      .then((json) => {
        setData(json)
        setIsPending(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Failed to fetch')
        setIsPending(false)
      })

    return () => controller.abort()
  }, [url])

  return { data, isPending, error }
}

export default useFetch
