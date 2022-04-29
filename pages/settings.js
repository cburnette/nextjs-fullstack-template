import SidebarNav from '../components/sidebarNav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import OrgSettings from '../components/orgSettings'

export default function Settings() {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  })

  if (session) return (
    <>
      <SidebarNav page="settings">
        <OrgSettings/>
      </SidebarNav>
    </>
  )
}