import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
export function Conversation() {
  const [conversation, setConversation] = useState(null)
  const [error, setError] = useState(null)
  const [inputValue, setInputValue] = useState("")
  const { conversationId } = useParams()

  async function getMessages() {
    try {
      const conversation = await axios.get(
        `http://localhost:3001/api/conversations/${conversationId}`
      )
      setConversation(conversation.data)
    } catch (error) {
      console.log(error)
      switch (error.code) {
        case "ERR_BAD_REQUEST":
          setError("Bad Request")
          break
        default:
          setError("something went wrong")
      }
    }
  }

  const mapMessages = () => {
    return conversation.messages.map((message, index) => (
      <div key={index}>{message.message}</div>
    ))
  }

  const inputChangeHandler = (event) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    getMessages()
    return () => {
      getMessages()
    }
  }, [conversationId])

  return (
    <div>
      {!conversation ? <div>{error}</div> : mapMessages()}
      <input
        placeholder="type message"
        type="text"
        value={inputValue}
        onChange={inputChangeHandler}
      ></input>
    </div>
  )
}
