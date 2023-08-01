import { useState, useEffect } from "react";

const useFetch = (postUrl, options) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // config default pre url
  const preUrl = "http://127.0.0.1:8000/"
  const url = preUrl + postUrl

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(url, options)
        if (!res.ok) {
          throw new Error(res.statusText)
        }
        const json = await res.json()
        setData(json)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    return () => {
      setData(null)
      setError(null)
      setLoading(false)
    }
  }, [url, options])

  return { data, error, loading }
}

export default useFetch;