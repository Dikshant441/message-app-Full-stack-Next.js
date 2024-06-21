'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
  
    <div >
      Not signed in <br />
      <button className="bg-orange-500 p-3 rounded-lg m-2"  onClick={() => signIn()}>Sign in</button>
    </div>
      
  )
}