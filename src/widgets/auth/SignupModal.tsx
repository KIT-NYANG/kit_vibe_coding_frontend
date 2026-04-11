import { useId, useState, type SubmitEvent } from 'react'
import type { SignupRequestBody, UserRole } from '../../entities/auth/types'
import { useEmailCheck } from '../../features/auth/useEmailCheck'
import { LockKeyholeOpen, Mail, ShieldCheck, UserRoundPen, UserRoundCog, Phone, BookMarked } from 'lucide-react'

interface SignupModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: SignupRequestBody) => Promise<void>
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'STUDENT', label: '학생 (STUDENT)' },
  { value: 'TEACHER', label: '강사 (TEACHER)' },
]

export const SignupModal = ({ open, onClose, onSubmit }: SignupModalProps) => {
  const titleId = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('STUDENT')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const { status: emailStatus, message: emailMessage, isEmailAvailable, isChecking, checkEmail, reset } =
    useEmailCheck()

  if (!open) return null

  const ageNum = parseInt(age, 10)
  const ageValid = !Number.isNaN(ageNum) && ageNum >= 1 && ageNum <= 120
  const passwordsMatch = password.length > 0 && password === passwordConfirm
  const passwordsMismatch =
    passwordConfirm.length > 0 && password.length > 0 && password !== passwordConfirm
  const passwordLengthValid = password.length >= 8 && password.length < 20

  const canSubmit =
    email.trim().length > 0 &&
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    ageValid &&
    passwordLengthValid &&
    passwordsMatch &&
    isEmailAvailable &&
    !isChecking

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setPending(true)
    try {
      const payload: SignupRequestBody = {
        email: email.trim(),
        password,
        passwordConfirm,
        name: name.trim(),
        age: ageNum,
        phone: phone.trim(),
        role,
      }
      await onSubmit(payload)
      setEmail('')
      setPassword('')
      setPasswordConfirm('')
      setName('')
      setAge('')
      setPhone('')
      setRole('STUDENT')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
    >
      <button
        type="button"
        aria-label="닫기"
        className="fixed inset-0 bg-palette-primary/40"
        onClick={onClose}
      />
      <div className="relative z-10 my-8 w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl ring-1 ring-palette-primary/15">
        <h2 id={titleId} className="text-lg font-semibold text-fg">
          회원가입
        </h2>
        <p className="mt-1 text-sm text-fg-subtle">필수 정보를 입력해 주세요.</p>

        <form className="mt-6 max-h-[min(70vh,560px)] space-y-3 overflow-y-auto pr-1" onSubmit={handleSubmit}>
          <div>
            <div className="mt-1 flex overflow-hidden rounded-lg border border-palette-primary/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-palette-primary/30">
              <span className="inline-flex items-center border-r border-palette-primary/15 bg-surface px-3 text-palette-primary">
                <Mail aria-hidden className="h-4 w-4" strokeWidth={2} />
              </span>
            <input
              autoComplete="email"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              id="signup-email"
              name="email"
              required
              type="email"
              value={email}
              placeholder="이메일을 입력해 주세요"
              onBlur={() => checkEmail(email)}
              onChange={(e) => {
                setEmail(e.target.value)
                reset()
              }}
            />
            {emailStatus !== 'idle' ? (
              <p
                className={`mt-2 rounded-md px-2 py-0.5 text-xs ${
                  emailStatus === 'available'
                    ? 'text-emerald-700'
                    : emailStatus === 'checking'
                      ? 'text-fg-subtle'
                      : 'text-red-600'
                }`}
                role={emailStatus === 'available' ? undefined : 'alert'}
              >
                {emailMessage}
              </p>
            ) : null}
          </div>
            <div className="mt-1 flex overflow-hidden rounded-lg border border-palette-primary/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-palette-primary/30">
              <span className="inline-flex items-center border-r border-palette-primary/15 bg-surface px-3 text-palette-primary">
                <LockKeyholeOpen aria-hidden className="h-4 w-4" strokeWidth={2} />
              </span>
            <input
              autoComplete="new-password"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              id="signup-password"
              name="password"
              minLength={8}
              maxLength={19}
              required
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!passwordLengthValid && password.length > 0 ? (
              <p className="mt-1 text-xs text-red-600 px-2 py-1.5" role="alert">
                8자 이상 20자 미만이어야 합니다.
              </p>
            ) : null}
          </div>
          <div className="mt-1 flex overflow-hidden rounded-lg border border-palette-primary/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-palette-primary/30">
              <span className="inline-flex items-center border-r border-palette-primary/15 bg-surface px-3 text-palette-primary">
                <ShieldCheck aria-hidden className="h-4 w-4" strokeWidth={2} />
              </span>
            <input
              autoComplete="new-password"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              id="signup-password2"
              name="passwordConfirm"
              required
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            {passwordsMismatch ? (
              <p className="mt-2 rounded-md px-2 py-0.5 text-xs text-red-600" role="alert">
                비밀번호가 일치하지 않습니다.
              </p>
            ) : null}
          </div>
          <div className="mt-1 flex overflow-hidden rounded-lg border border-palette-primary/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-palette-primary/30">
              <span className="inline-flex items-center border-r border-palette-primary/15 bg-surface px-3 text-palette-primary">
                <UserRoundPen aria-hidden className="h-4 w-4" strokeWidth={2} />
              </span>
            <input
              autoComplete="name"
              className="w-full bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              id="signup-name"
              name="name"
              required
              type="text"
              placeholder="이름을 입력해 주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-1 flex overflow-hidden rounded-lg border border-palette-primary/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-palette-primary/30">
              <span className="inline-flex items-center border-r border-palette-primary/15 bg-surface px-3 text-palette-primary">
                <UserRoundCog aria-hidden className="h-4 w-4" strokeWidth={2} />
              </span>
            <input
              className="w-full bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              id="signup-age"
              inputMode="numeric"
              min={1}
              max={120}
              name="age"
              required
              type="number"
              placeholder="나이를 입력해 주세요"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mt-1 flex overflow-hidden rounded-lg border border-palette-primary/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-palette-primary/30">
              <span className="inline-flex items-center border-r border-palette-primary/15 bg-surface px-3 text-palette-primary">
                <Phone aria-hidden className="h-4 w-4" strokeWidth={2} />
              </span>
            <input
              autoComplete="tel"
              className="w-full bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              id="signup-phone"
              name="phone"
              placeholder="010-0000-0000"
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mt-1 flex overflow-hidden rounded-lg border border-palette-primary/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-palette-primary/30">
              <span className="inline-flex items-center border-r border-palette-primary/15 bg-surface px-3 text-palette-primary">
                <BookMarked aria-hidden className="h-4 w-4" strokeWidth={2} />
              </span>
            <select
              className="w-full bg-transparent px-3 py-2 text-sm text-fg focus:outline-none"
              id="signup-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg border border-palette-primary/25 bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-palette-accent/15"
              disabled={pending}
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-palette-primary px-4 py-2 text-sm font-medium text-palette-white hover:bg-palette-primary/90 disabled:opacity-50"
              disabled={pending || !canSubmit}
            >
              {pending ? '처리 중…' : '가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
