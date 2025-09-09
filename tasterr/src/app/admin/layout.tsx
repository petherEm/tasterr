import { Suspense } from "react"
import { checkAdminAccess } from "@/app/actions/admin"
import { AdminNavbar } from "@/components/admin/admin-navbar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect if not admin
  await checkAdminAccess()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        }>
          {children}
        </Suspense>
      </div>
    </div>
  )
}