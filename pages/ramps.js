import SidebarNav from '../components/sidebarNav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import RampsList from '../components/rampsList'
import CreateRamp from '../components/createRamp'

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
      <SidebarNav page="ramp models">
        <CreateRamp/>
        <RampsList/>
      </SidebarNav>
    </>
  )
}