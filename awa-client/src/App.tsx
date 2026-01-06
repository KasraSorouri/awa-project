import { useState, useEffect } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Header from './components/Header'
import ShowRecycledFiles from './components/ShowRecycledFiles'
import { useToken } from './services/useToken'

import userService from './services/userService'
import UserPage from './components/UserPage'

import { IRecycledFiles } from './types/folderTypes'
import fileService from './services/fileService'

interface IUserData {
  user_id: number,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
}


function App() {
  const [user, setUser] = useState<IUserData | null>(null)
  const [recycledFiles, setRecycledFiles] = useState<IRecycledFiles[]>([])
  const [counter, setCounter] = useState({
    fileCounter: 0,
    folderCounter: 0,
    sharedCounter: 0
  })

  const {token} = useToken()
  console.log('app user : ', user)
  
  useEffect(() => {
    const getUserInfo = async() => {
      try{
        const result = await userService.getUser()
        if (result) {
          setUser(result)
        }
      } catch (error) {
        console.log(error)
      }
    }
    

    const getDeletedFiles = async () => {
      try {
        const recycled = await fileService.getRecycleBin()
        if (recycled) {
          setRecycledFiles(recycled)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
        console.log(error)
      }
    }
    
    if (token) {
      getUserInfo()
      getDeletedFiles()
    }
  }, [token])

  return (
    <>
      <BrowserRouter>
        <Header user={user} counter={counter} recycledFiles={recycledFiles} />
        <Routes>
          <Route path='/' element={user ? <UserPage setCounter={setCounter}  /> : <Login /> }/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recycled' element={user ? <ShowRecycledFiles recycledFiles={recycledFiles} /> : <Login /> } />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
