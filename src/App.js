import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Login() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  let isPresent = false

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user))

      navigate('/home')
    }
  }, [navigate])

  const handleSubmit = () => {
    if (!username.length) {
      alert('Please enter a username')
    }

    let session = localStorage.getItem('session')
    session = session ? JSON.parse(session) : []

    let payload

    isPresent = session.some((s) => {
      return s.username === username && s.status === 'idle'
    })
    if (session.length > 0 && isPresent) {
      session = session.map((s) => {
        if (s.username !== username) {
          return s
        }
        return {
          ...s,
          time: new Date(),
          status: 'active',
        }
      })
    } else {
      payload = { username, time: new Date(), status: 'active' }

      session.push(payload)
    }

    localStorage.setItem('session', JSON.stringify(session))
    localStorage.setItem('user', JSON.stringify(payload))

    sessionStorage.setItem('user', JSON.stringify(payload))

    navigate('/home')
  }

  const handleChange = (e) => {
    e.preventDefault()
    setUsername(e.target.value)
  }

  return (
    <div className="login_section">
      <h2>Nice to have you &#127881; !!!</h2>
      <p>Log-in here &#128071;</p>
      <div className="login-input">
        <input
          type="text"
          onChange={handleChange}
          placeholder="Enter Username"
        />
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  )
}

function Home() {
  const [focus, setFocus] = useState(true)

  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user'))
  let session = JSON.parse(localStorage.getItem('session'))

  useEffect(() => {
    let session = JSON.parse(localStorage.getItem('session'))

    const updateSession = () => {
      session = session.map((s) => {
        if (s.username !== user.username) {
          return s
        }
        return {
          ...s,
          status: 'idle',
        }
      })

      localStorage.setItem('session', JSON.stringify(session))
    }

    if (document.hasFocus()) {
      setFocus(true)
    }

    if (!focus) {
      updateSession()
    }
  }, [focus, user.username])

  const handleLogOut = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')

    navigate('/')
  }

  const logoutUser = (username) => {
    let session = JSON.parse(localStorage.getItem('session'))
    session = session.filter((s) => {
      return s.username !== username
    })

    localStorage.setItem('session', JSON.stringify(session))

    if (user.username === username) {
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      navigate('/')
    }
  }

  return (
    <div className="home-section">
      <div className="container ">
        <div className="d-flex">
          <h5 className="me-3 mt-1">{user.username}</h5>
          <div>
            <button onClick={handleLogOut}>Logout</button>
          </div>
        </div>

        <div className="mt-5">
          <h2>Welcome !!!</h2>

          <table className="manage-user">
            <tbody>
              <tr>
                <th>Username</th>
                <th>date</th>
                <th>Status</th>
                <th></th>
              </tr>

              {session.map((s) => {
                return (
                  <tr key={s.username}>
                    <td>{s.username}</td>
                    <td>{s.time}</td>
                    <td>{s.status}</td>
                    <td>
                      <button onClick={() => logoutUser(s.username)}>
                        logout user
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
