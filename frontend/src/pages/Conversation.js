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
      console.log("get")
    } catch (error) {
      switch (error.code) {
        case "ERR_BAD_REQUEST":
          setError("Bad Request")
          break
        default:
          setError("something went wrong")
      }
    }
  }

  async function postMessage(getMessages) {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/conversations/${conversationId}/messages`,
        {
          sender: "Sage",
          message: inputValue,
          timestamp: new Date().toLocaleTimeString(),
        }
      )
      if (response.status === 200) {
        getMessages()
      }
      console.log(response)
    } catch (error) {
      console.log(error.code)
    }
    setInputValue("")
  }

  async function deleteMessage(messageId, getMessages) {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/conversations/${conversationId}/messages/${messageId}`
      )
      if (response.status === 200) {
        getMessages()
      }
    } catch (error) {
      setError(error.code)
    }
  }

  async function deleteMessages(getMessages) {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/conversations/${conversationId}/messages`
      )
      console.log(response.status)
      if (response.status === 200) {
        getMessages()
      }
    } catch (error) {
      setError(error)
    }
  }

  const mapMessages = (getMessages) => {
    return conversation.messages.map((message, index) => (
      <div key={index}>
        {message.message}
        <button onClick={() => deleteMessage(message._id, getMessages)}>
          delete
        </button>
      </div>
    ))
  }

  const inputChangeHandler = (event) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    getMessages()
  }, [conversationId])

  return (
    <div>
      <button onClick={() => deleteMessages(getMessages)}>Delete All</button>
      {!conversation ? <div>{error}</div> : mapMessages(getMessages)}
      <input
        placeholder="type message"
        type="text"
        value={inputValue}
        onChange={inputChangeHandler}
      ></input>
      <button onClick={() => postMessage(getMessages)}>send</button>
    </div>
  )
}
