import { useState } from 'react'
import './App.css'

type Message = {
  text: string
  sender: 'user' | 'ai'
}

async function postQuestionAPI(question: string) {
  const response = await fetch('http://localhost:3000/askQuestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function postQuestion(questionText: string) {
    setIsLoading(true)
    setMessages((prev) => [...prev, { text: questionText, sender: 'user' }])
    const { data } = await postQuestionAPI(questionText)
    setIsLoading(false)
    setMessages((prev) => [...prev, { text: data, sender: 'ai' }])
  }

  function handleAskQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (question.trim()) {
      postQuestion(question).catch(console.error)
      setQuestion('')
    }
  }

  return (
    <div>
      <h1>Tannie Magdel</h1>
      <div className="chat-container">
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ))}
          {isLoading && <div className="message ai">...</div>}
        </div>
        <div className="input-area">
          <form onSubmit={handleAskQuestion}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Tik iets..."
            />
            <button type="submit">Stuur</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
