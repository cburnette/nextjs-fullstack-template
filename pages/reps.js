import SidebarNav from '../components/sidebarNav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import RepsList from '../components/repsList'
import CreateRep from '../components/createRep'

export default function Reps() {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  })

  if (session) return (
    <>
      <SidebarNav page="reps">
        <CreateRep/>
        <RepsList/>
      </SidebarNav>
    </>
  )
}