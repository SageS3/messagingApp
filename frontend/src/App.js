import { Link, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Conversations } from "./pages/Conversations"
import { Conversation } from "./pages/Conversation"
import axios from "axios"
import "./App.css"

function App() {
  const getConversations = () => {
    axios
      .get("http://localhost:3000/api/conversations")
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  getConversations()
  return (
    <div className="App">
      <nav>
        <button>
          <Link to="/">Home</Link>
        </button>
        <button>
          <Link to="/conversations">Threads</Link>
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/conversations/:id/" element={<Conversation />} />
      </Routes>
    </div>
  )
}

export default App
