'use client'
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import Navbar from "@/components/navbar"
import { usePathname } from 'next/navigation'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showNavbar = pathname !== '/login'

  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="layout">
            {showNavbar && <Navbar />}
            <div className="content">
              {children}
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}