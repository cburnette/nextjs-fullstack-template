import SidebarNav from '../components/sidebarNav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import BudgetList from '../components/bugdetList'

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
      <SidebarNav page="budgets">
        <BudgetList/>
      </SidebarNav>
    </>
  )
}