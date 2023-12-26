import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className={`text-sm font-medium transition-colors ${
          router.pathname === "/dashboard" ? "" : "text-muted-foreground"
        }`}
      >
        Overview
      </Link>
      <Link
        href="/members"
        className={`text-sm font-medium transition-colors ${
          router.pathname === "/members" ? "" : "text-muted-foreground"
        }`}
      >
        Members
      </Link>
      <Link
        href="/companies"
        className={`text-sm font-medium transition-colors ${
          router.pathname === "/companies" ? "" : "text-muted-foreground"
        }`}
      >
        Companies
      </Link>
      <Link
        href="/licenses"
        className={`text-sm font-medium transition-colors ${
          router.pathname === "/licenses" ? "" : "text-muted-foreground"
        }`}
      >
        Licenses
      </Link>
    </nav>
  )
}
