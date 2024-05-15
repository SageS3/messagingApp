import { Link, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Conversations } from "./pages/Conversations"
import "./App.css"

function App() {
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
      </Routes>
    </div>
  )
}

export default App
