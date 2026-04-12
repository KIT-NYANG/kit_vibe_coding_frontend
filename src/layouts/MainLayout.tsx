import { useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthSession } from '../features/auth/useAuthSession'
import { useAuthStore } from '../features/auth/authStore'
import { useSignup } from '../features/auth/useSignup'
import { brandData } from '../features/brand/brandData'
import { LoginModal } from '../widgets/auth/LoginModal'
import { SignupModal } from '../widgets/auth/SignupModal'
import { MainWireHeader } from '../widgets/main/MainWireHeader'
import type { MainLayoutOutletContext } from './mainLayoutContext'

export const MainLayout = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn, loginWithCredentials, logout } = useAuthSession()
  const sessionExpiredHint = useAuthStore((s) => s.sessionExpiredHint)
  const clearSessionExpiredHint = useAuthStore((s) => s.clearSessionExpiredHint)
  const { submitSignup } = useSignup()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)

  const loginModalVisible = loginModalOpen || Boolean(sessionExpiredHint)

  const outletContext = useMemo<MainLayoutOutletContext>(
    () => ({
      openLoginModal: () => setLoginModalOpen(true),
    }),
    [],
  )

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <MainWireHeader
        brand={brandData}
        isLoggedIn={isLoggedIn}
        welcomeName={user?.displayName}
        onWelcomeNameClick={
          isLoggedIn && user?.role === 'STUDENT' ? () => navigate('/mypage') : undefined
        }
        onLogout={logout}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenSignup={() => setSignupModalOpen(true)}
      />
      <main className="mx-auto px-4 py-6 sm:px-6">
        <Outlet context={outletContext} />
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
