import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'

const Home = () => {
  const session = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = session?.user;

      if (user) {
        setLoading(false);
      } else {
        router.push('/login');
      }
    };

    if (session) {
      checkUser()
    }
  }, [session]) 

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>Home</div>
  )
}

export default Home
