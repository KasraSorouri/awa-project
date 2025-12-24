import { useState, useEffect } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Header from './components/Header'
import { useToken } from './services/useToken'

import userService from './services/userService'

interface IUserData {
  user_id: number,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
}



function App() {
  const [user, setUser] = useState<IUserData | null>(null)
  console.log(' app user ', user)
  const {token} = useToken()

  useEffect(() => {
    const getUserInfo = async(token: string) => {
      try{
        const result = await userService.getUser(token)
        if (result) {
          setUser(result)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (token) {
      getUserInfo(token)
    }
  }, [token])
  
  return (
    <>
    <Header user={user}/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<h1>Home</h1>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
