import { useState } from 'react'
import axios from "axios";
import { FaGithub } from "react-icons/fa";


function App() {
  const [username, setUsername] = useState("");
  const [profile,setProfile]=useState(null);
  const analyzeProfile=async ()=>{
    try{
      const response=await axios.get(`http://localhost:5000/api/analyze/${username}`);
      setProfile(response.data);
    }catch(error){
      console.log(error)
    }
  }
  return (
    <div className="container">
      <FaGithub size={120} />
      <h1>GitRank</h1>
      <p>track your Github contribution</p>
      <input type="text" onChange={(e)=>setUsername(e.target.value)} placeholder="Enter Github Username" />
      <button type="submit" onClick={analyzeProfile}>Analyze</button>
      {
        profile && <div className='profile-report'>
        {
          Object.entries(profile).map(([key, value]) => (
          <p key={key}>
            <strong>{key}</strong>: {String(value)}
          </p>
        ))
      }
        </div>
      }
    </div>
  )
}

export default App
