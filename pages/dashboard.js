import SidebarNav from '../components/sidebarNav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  })

  if (session) return (
    <>
      <SidebarNav page="dashboard">
        <p className="text-center text-xl mt-20">Dashboard</p>
      </SidebarNav>
    </>
  )
}