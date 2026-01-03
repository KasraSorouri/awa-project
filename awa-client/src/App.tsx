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
import folderService from './services/folderService'

import { IRecycledFiles, IFolderTree } from './types/folderTypes'
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
  const [folders, setFolders] = useState<IFolderTree[]>([])
  const [recycledFiles, setRecycledFiles] = useState<IRecycledFiles[]>([])

  const {token} = useToken()
  console.log('app user : ', user)
  console.log('app folders : ', folders)
  console.log('recycled bin:', recycledFiles
    
  )
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

    const getUserFiles = async () => {
      try {
        const result = await folderService.getUserFolders()
        if (result) {
          setFolders([...result])
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
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
      getUserFiles()
      getDeletedFiles()
    }
  }, [token])

  return (
    <>
      <BrowserRouter>
        <Header user={user} folders={folders} recycledFiles={recycledFiles} />
        <Routes>
          <Route path='/' element={user ? <UserPage folders={folders} /> : <Login /> } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recycled' element={user ? <ShowRecycledFiles recycledFiles={recycledFiles} /> : <Login /> } />
        </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
