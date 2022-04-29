import SidebarNav from '../components/sidebarNav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import TeamsList from '../components/teamsList'
import CreateTeam from '../components/createTeam'

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
      <SidebarNav page="teams">
        <CreateTeam/>
        <TeamsList/>
      </SidebarNav>
    </>
  )
}