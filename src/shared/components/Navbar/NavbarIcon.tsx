import { User } from "lucide-react"

type Props = {
  isMobile?: boolean
  tone?: "light" | "dark"
}

const NavbarLoginIcon = ({ isMobile = false, tone = "dark" }: Props) => {
  const iconClasses = isMobile ? "h-8 w-8" : "h-6 w-6"
  const adminUrl = import.meta.env.VITE_ADMIN_URL

  // ✅ SOLO PALETA
  const cls =
    tone === "light"
      ? "text-[#FAFDF4]/90 hover:text-[#FAFDF4]"
      : "text-[#1F3D2B] hover:text-[#2F5F0B]"

  return (
    <a href={`${adminUrl}/login`} className={cls} aria-label="Login admin">
      <User className={iconClasses} />
    </a>
  )
}

export default NavbarLoginIcon
