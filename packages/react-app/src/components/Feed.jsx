import React, { useState, useEffect } from 'react'
import { Row } from 'antd'
import Tune from './Tune'

/** Select a random host  */
const selectHost = async () => {
  const sample = arr => arr[Math.floor(Math.random() * arr.length)]
  const res = await fetch('https://api.audius.co')
  const hosts = await res.json()
  return sample(hosts.data)
}

const Feed = ({ writeContracts, tx }) => {
  const [tracks, setTracks] = useState(null)
  
  useEffect(() => {
    const getFeed = async () => {
      const host = await selectHost();
      const res = await fetch(
        `${host}/v1/tracks/trending?limit=1&timeRange=week`
      );
      const json = await res.json()
      console.log(json.data);
      setTracks(json.data)
    };
    getFeed();
  }, []);

  return tracks && (
    tracks.map(track => {
      return (
        <Tune key={track.id} writeContracts={writeContracts} tx={tx} track={track} />
      )
    })
  )
}

export default Feed