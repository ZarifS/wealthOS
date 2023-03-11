import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { RootState } from '../store'

const Home: NextPage = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn])

  return (
    <div className="">
      <h1>wealthOS</h1>
    </div>
  )
}

export default Home
