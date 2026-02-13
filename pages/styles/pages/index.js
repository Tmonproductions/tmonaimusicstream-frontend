import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  const backendURL = "https://tmonaimusicstream-backend-production.up.railway.app";

  useEffect(() => {
    axios.get(`${backendURL}/tracks`).then(res => setTracks(res.data));
  }, []);

  const uploadTrack = async () => {
    if (!file) return alert("Select a file!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);

    const res = await axios.post(`${backendURL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setTracks([...tracks, res.data]);
    setTitle(""); setArtist(""); setFile(null);
  };

  const streamTrack = async (id) => {
    const res = await axios.post(`${backendURL}/stream/${id}`);
    alert(`Streams: ${res.data.streams} | Earnings: $${res.data.earnings.toFixed(2)}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">TmonAI Music Stream</h1>

      <div className="mb-6">
        <input type="text" placeholder="Track Title" value={title} onChange={e => setTitle(e.target.value)} className="p-2 mr-2 text-black"/>
        <input type="text" placeholder="Artist Name" value={artist} onChange={e => setArtist(e.target.value)} className="p-2 mr-2 text-black"/>
        <input type="file" onChange={e => setFile(e.target.files[0])} className="p-2 mr-2"/>
        <button onClick={uploadTrack} className="bg-green-500 px-4 py-2 rounded">Upload</button>
      </div>

      <h2 className="text-2xl font-bold mb-2">Tracks</h2>
      {tracks.map(track => (
        <div key={track.id} className="mb-2 p-2 border border-gray-700 rounded flex justify-between">
          <div>
            {track.title} - {track.artist}
          </div>
          <button onClick={() => streamTrack(track.id)} className="bg-blue-500 px-3 py-1 rounded">Stream</button>
        </div>
      ))}
    </div>
  );
}
