import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from './MasonryLayout.jsx'
import Spinner from './Spinner.jsx'
import { searchQuery, feedQuery } from '../utils/data.js'

const Feed = () => {
  const [loading, setLoading] = useState(true)
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams()

  useEffect(() => {
    if (categoryId) {
      const query = searchQuery(categoryId)
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    } else {
      const query = feedQuery
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }
  }, [categoryId])

  if (loading) {
    return <Spinner message={'We are adding new ideas to your feed!'} />
  } else return (
    <div>
      {pins?.length === 0
        ? (
          <div className="mt-10 text-center text-xl ">
            No Pins Found!
          </div>
        ) : (
          <MasonryLayout pins={pins}></MasonryLayout>
        )}
    </div>
  )
}

export default Feed 