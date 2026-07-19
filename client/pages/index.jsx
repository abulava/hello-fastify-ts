import React, { useState, useEffect } from 'react'

export const getMeta = () => {
  return {
    title: 'Hello world',
  }
}

const IndexPage = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/example')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
      })
      .catch((err) => {
        setError(err)
      })
  }, [])

  return (
    <>
      <h1>Hello world from @fastify/react!</h1>
      <p>{error ? 'Failed to load' : data ? data.message : 'Loading...'}</p>
    </>
  )
}

export default IndexPage
