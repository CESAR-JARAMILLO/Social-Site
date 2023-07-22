import type { AppProps } from 'next/app'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient';
import { ChakraProvider, Box } from '@chakra-ui/react'
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
        <Box bgColor="#f5f7fb" minH="100vh">
          <Navbar />
          <Component {...pageProps} />
        </Box>
      </SessionContextProvider>
    </ChakraProvider>
  )
}
