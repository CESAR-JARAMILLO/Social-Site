import type { AppProps } from 'next/app'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient';

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
