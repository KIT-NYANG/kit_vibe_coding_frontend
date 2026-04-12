import { useCallback } from 'react'
import type { SignupRequestBody } from '../../entities/auth/types'
import { postSignup } from '../../shared/api/authApi'

export const useSignup = () => {
  const submitSignup = useCallback(async (payload: SignupRequestBody) => {
    return postSignup(payload)
  }, [])

  return { submitSignup }
}
