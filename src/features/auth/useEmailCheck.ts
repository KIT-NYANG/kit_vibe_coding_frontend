import { useCallback, useMemo, useState } from 'react'
import { getCheckEmail } from '../../shared/api/authApi'

export type EmailCheckStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'duplicate' | 'error'

const emailRegex =
  // 충분히 엄격하면서 과도하게 복잡하지 않은 형태
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const useEmailCheck = () => {
  const [status, setStatus] = useState<EmailCheckStatus>('idle')
  const [message, setMessage] = useState<string>('')

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage('')
  }, [])

  const checkEmail = useCallback(async (rawEmail: string) => {
    const email = rawEmail.trim()
    if (email.length === 0) {
      reset()
      return
    }
    if (!emailRegex.test(email)) {
      setStatus('invalid')
      setMessage('이메일 형식이 올바르지 않습니다.')
      return
    }

    setStatus('checking')
    setMessage('이메일을 확인 중입니다…')
    try {
      const okMessage = await getCheckEmail(email)
      setStatus('available')
      setMessage(okMessage || '사용 가능한 이메일입니다.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : '이메일 확인에 실패했습니다.'
      // 서버가 중복 이메일이면 400 + "이메일이 이미 존재합니다." 를 내려줌
      if (msg.includes('이미 존재')) {
        setStatus('duplicate')
        setMessage(msg)
        return
      }
      setStatus('error')
      setMessage(msg)
    }
  }, [reset])

  const isEmailAvailable = useMemo(() => status === 'available', [status])
  const isChecking = useMemo(() => status === 'checking', [status])

  return { status, message, isEmailAvailable, isChecking, checkEmail, reset }
}

