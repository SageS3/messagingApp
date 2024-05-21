import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
export function Conversations() {
  const [conversations, setConversations] = useState(null)
  const [getDataError, setGetDataError] = useState(undefined)

  async function getConversations() {
    try {
      const res = await axios.get("http://localhost:3001/api/conversations")
      setConversations(res.data.conversations)
    } catch (error) {
      setGetDataError(error.message)
    }
  }

  function mapConversations() {
    return (
      <>
        {conversations.map((conversation, index) => (
          <div key={index}>
            <p>{conversation.time}</p>
            <button>
              <Link to={`/conversations/${conversation._id}`}>View</Link>
            </button>
          </div>
        ))}
      </>
    )
  }

  useEffect(() => {
    getConversations()
  }, [])

  return (
    <div>
      <div>
        {!conversations ? <div>{getDataError}</div> : mapConversations()}
      </div>
    </div>
  )
}
