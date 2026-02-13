// pages/index.js
import { useState, useEffect } from 'react'

export default function Home() {
  const [tracks, setTracks] = useState([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [file, setFile] = useState(null)

  const backendUrl = 'https://tmonaimusicstream-backend-production.up.railway.app'

  useEffect(() => {
    fetch(`${backendUrl}/tracks`)
      .then(res => res.json())
      .then(data => setTracks(data))
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert('Select a file!')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('artist', artist)
    formData.append('file', file)

    const res = await fetch(`${backendUrl}/tracks`, {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      const newTrack = await res.json()
      setTracks([...tracks, newTrack])
      setTitle('')
      setArtist('')
      setFile(null)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">TmonAI Music Stream</h1>

      <form onSubmit={handleUpload} className="mb-6 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Track Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded text-black"
          required
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="p-2 rounded text-black"
          required
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" className="bg-blue-600 p-2 rounded mt-2">Upload Track</button>
      </form>

      <div>
        <h2 className="text-2xl mb-2">Tracks</h2>
        {tracks.length === 0 && <p>No tracks yet.</p>}
        <ul className="flex flex-col gap-2">
          {tracks.map((track) => (
            <li key={track.id} className="p-2 bg-gray-800 rounded flex justify-between items-center">
              <div>
                <p className="font-bold">{track.title}</p>
                <p className="text-sm">{track.artist}</p>
              </div>
              <audio controls className="w-48">
                <source src={`${backendUrl}/uploads/${track.filename}`} type="audio/mpeg" />
              </audio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
          }
