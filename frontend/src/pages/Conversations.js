import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
export function Conversations() {
  const [conversations, setConversations] = useState(null)
  const [error, setError] = useState(undefined)

  async function getConversations() {
    try {
      const res = await axios.get("http://localhost:3001/api/conversations")
      setConversations(res.data.conversations)
    } catch (error) {
      setError(error.message)
    }
  }

  async function deleteConversation(getConversations, id) {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/conversations/${id}`
      )
      if (response.status === 200) {
        getConversations()
      }
    } catch (error) {
      setError(error)
    }
  }

  async function addConversation(getConversations) {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/conversations"
      )
      console.log(response.status)
      if (response.status === 201) {
        getConversations()
      }
    } catch (error) {
      setError(error)
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
            <button
              onClick={() =>
                deleteConversation(getConversations, conversation._id)
              }
            >
              Delete
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
      <button onClick={() => addConversation(getConversations)}>
        add thread
      </button>
      <div>{!conversations ? <div>{error}</div> : mapConversations()}</div>
    </div>
  )
}
