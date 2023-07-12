import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import { useEffect } from 'react'

const Home = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if(!session) {
      console.log('you are not logged in')
      router.push('/login')
    }
  }, []) 

  return (
    <div>Home</div>
  )
}

export default Home