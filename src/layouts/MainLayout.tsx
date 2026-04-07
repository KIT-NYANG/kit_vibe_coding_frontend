import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthSession } from '../features/auth/useAuthSession'
import { useAuthStore } from '../features/auth/authStore'
import { useSignup } from '../features/auth/useSignup'
import { brandData } from '../features/brand/brandData'
import { LoginModal } from '../widgets/auth/LoginModal'
import { SignupModal } from '../widgets/auth/SignupModal'
import { MainWireHeader } from '../widgets/main/MainWireHeader'

export const MainLayout = () => {
  const { user, isLoggedIn, loginWithCredentials, logout } = useAuthSession()
  const sessionExpiredHint = useAuthStore((s) => s.sessionExpiredHint)
  const clearSessionExpiredHint = useAuthStore((s) => s.clearSessionExpiredHint)
  const { submitSignup } = useSignup()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)

  const loginModalVisible = loginModalOpen || Boolean(sessionExpiredHint)

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <MainWireHeader
        brand={brandData}
        isLoggedIn={isLoggedIn}
        welcomeName={user?.displayName}
        onLogout={logout}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenSignup={() => setSignupModalOpen(true)}
      />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <LoginModal
        notice={sessionExpiredHint}
        open={loginModalVisible}
        onClose={() => {
          clearSessionExpiredHint()
          setLoginModalOpen(false)
        }}
        onSubmit={loginWithCredentials}
      />
      <SignupModal
        open={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSubmit={async (payload) => {
          await submitSignup(payload)
        }}
      />
    </div>
  )
}
