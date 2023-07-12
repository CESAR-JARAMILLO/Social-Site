import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { signOut, getCurrentUser } from './api/auth';

const Home = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut();
    router.push('/login')
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        setLoading(false);
      } else {
        setLoading(false);
        router.push('/login');
      }
    };

    checkUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>
        Home
      </div>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Home
