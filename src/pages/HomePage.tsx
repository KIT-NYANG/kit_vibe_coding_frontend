import { useState } from 'react'
import { useAuthSession } from '../features/auth/useAuthSession'
import { useSignup } from '../features/auth/useSignup'
import { useMainHome } from '../features/main/useMainHome'
import { LoginModal } from '../widgets/auth/LoginModal'
import { SignupModal } from '../widgets/auth/SignupModal'
import { CategoryChipRow } from '../widgets/main/CategoryChipRow'
import { CategoryPreviewGrid } from '../widgets/main/CategoryPreviewGrid'
import { HeroCarouselBanner } from '../widgets/main/HeroCarouselBanner'
import { MainWireHeader } from '../widgets/main/MainWireHeader'

export const HomePage = () => {
  const {
    model,
    currentSlideLine,
    goPrevSlide,
    goNextSlide,
    selectedCategoryId,
    selectCategory,
    displayedLectures,
    totalLecturesInCategory,
    showLectureArrows,
    canGoPrevLectures,
    canGoNextLectures,
    goPrevLectures,
    goNextLectures,
    selectedCategoryLabel,
  } = useMainHome()

  const { user, isLoggedIn, loginWithCredentials, logout } = useAuthSession()
  const { submitSignup } = useSignup()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)

  const slideLabel = `히어로 배너 ${model.heroSlides.length}장 중 표시`

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900">
      <MainWireHeader
        brand={model.brand}
        isLoggedIn={isLoggedIn}
        welcomeName={user?.displayName}
        onLogout={logout}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenSignup={() => setSignupModalOpen(true)}
      />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <HeroCarouselBanner
          line={currentSlideLine}
          onNext={goNextSlide}
          onPrev={goPrevSlide}
          slideLabel={slideLabel}
        />
        <CategoryChipRow
          categories={model.categories}
          selectedId={selectedCategoryId}
          onSelect={selectCategory}
        />
        <CategoryPreviewGrid
          canGoNext={canGoNextLectures}
          canGoPrev={canGoPrevLectures}
          categoryLabel={selectedCategoryLabel}
          lectures={displayedLectures}
          onNext={goNextLectures}
          onPrev={goPrevLectures}
          showArrows={showLectureArrows}
          totalInCategory={totalLecturesInCategory}
        />
      </main>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
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
