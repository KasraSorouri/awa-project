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

import { IFileCounter, IRecycledFiles } from './types/folderTypes'
import ShowExternalShare from './components/ShowExternalShare'
import ShowSharedFiles from './components/ShowSharedFiles'
import UserProfile from './components/UserProfile'

interface IUserData {
  user_id: number,
  username: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  picture?: string
}


function App() {
  const [user, setUser] = useState<IUserData | null>(null)
  const [recycledFiles, setRecycledFiles] = useState<IRecycledFiles[]>([])
  const [counter, setCounter] = useState({
    fileCounter: 0,
    folderCounter: 0,
    recycledCounter: 0,
    sharedCounter: 0
  })

  const {token} = useToken()

  const updateCounter = (newCounters: IFileCounter) => {
    setCounter({
      fileCounter: newCounters.fileCounter ? newCounters.fileCounter : counter.fileCounter,
      folderCounter: newCounters.folderCounter ? newCounters.folderCounter : counter.folderCounter,
      recycledCounter: newCounters.recycledCounter ? newCounters.recycledCounter : counter.recycledCounter,
      sharedCounter: newCounters.sharedCounter ? newCounters.sharedCounter : counter.sharedCounter,
    })
  }

  const updateUserData= async (userData: IUserData) => {
    setUser(userData)
  }

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
    
    if (token) {
      getUserInfo()
    }
  }, [token])

  console.log('counter :', counter)
  const hanldeUpdateRecycle = (action:'REMOVE' | 'RESTORE', id: number) => {
    if (action === 'REMOVE') {
      setRecycledFiles(recycledFiles.filter((file) => file.id !== id))
      updateCounter({recycledCounter: counter.recycledCounter - 1})
    } else if (action === 'RESTORE') {
      setRecycledFiles(recycledFiles.filter((file) => file.id !== id))
      updateCounter({recycledCounter: counter.recycledCounter - 1,
        fileCounter: counter.fileCounter + 1
      })
    } else {
      return
    }
  }

  return (
    <>
      <BrowserRouter>
        <Header user={user} counter={counter} />
        <Routes>
          <Route path='/' element={user ? <UserPage counter={counter} updateCounter={updateCounter} /> : <Login /> }/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recycled' element={user ? <ShowRecycledFiles updateCounter={updateCounter} hanldeUpdateRecycle={hanldeUpdateRecycle} /> : <Login /> } />
          <Route path='/sharedFiles' element={user ? <ShowSharedFiles /> : <Login /> } />
          <Route path='/share/:link' element={<ShowExternalShare />} />
          <Route path='/userProfile' element={user ? <UserProfile userData={user} setUser={updateUserData} /> : <Login /> } />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
