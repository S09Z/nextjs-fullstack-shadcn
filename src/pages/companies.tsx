import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { Metadata } from "next"
import Image from "next/image"

import { MainNav } from "@@/components/dashboard/main-nav"
import { UserNav } from "@@/components/dashboard/user-nav"

import Companies from '@@/module/companies'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function CompaniesPage() {
  const router = useRouter()

  useEffect(() => {
    const authTokenExpiration = localStorage.getItem("authTokenExpiration")
    const currentTime = new Date().getTime()

    if (!authTokenExpiration || currentTime > parseInt(authTokenExpiration)) {
      router.push("login")
    }
  }, [])

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav />
            </div>
          </div>
        </div>
        <Companies />
      </div>
    </>
  )
}