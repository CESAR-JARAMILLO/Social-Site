import type { AppProps } from 'next/app'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient';
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from '@/components/Navbar';

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {

  return (
    <ChakraProvider>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <Navbar />
        <Component {...pageProps} />
      </SessionContextProvider>
    </ChakraProvider>
  )
}
