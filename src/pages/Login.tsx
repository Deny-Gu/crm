import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useAuth } from '../providers/AuthProvider'
import CIcon from '@coreui/icons-react'
import {cibMailRu, cilLockLocked} from '@coreui/icons'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, user, ready } = useAuth()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // чтобы не дергать navigate дважды (из эффекта и из handleSubmit)
  const navigatedRef = useRef(false)

  // Если уже авторизованы после fetchMe — уводим с /login
  useEffect(() => {
    if (ready && user && !navigatedRef.current) {
      navigatedRef.current = true
      navigate('/', { replace: true })
    }
  }, [ready, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)
    try {
      await signIn({ login, password })
      if (!navigatedRef.current) {
        navigatedRef.current = true
        navigate('/', { replace: true })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err)
      setError(err || 'Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }

  const isInvalid = !login || !password

  if (!ready) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <CSpinner />
      </div>
    )
  }

  return (
    <CContainer className="min-vh-100 d-flex align-items-center justify-content-center">
      <CRow className="w-100 justify-content-center">
        <CCol xs={12} sm={10} md={7} lg={5} xl={4}>
          <CCard className="shadow-sm">
            <CCardHeader className="fw-semibold py-3 text-center">CRM</CCardHeader>
            <CCardBody>
              <h5 className='text-center mb-3'>Авторизация</h5>
              <CForm onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cibMailRu} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Логин"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      required
                      aria-label="Логин"
                    />
                  </CInputGroup>
                  <CFormFeedback invalid>Укажите логин</CFormFeedback>
                </div>
                <div className="mb-3">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-label="Пароль"
                    />
                  </CInputGroup>
                  <CFormFeedback invalid>Укажите пароль</CFormFeedback>
                </div>
                {error && (
                  <div className="text-danger text-center mb-2 small" role="alert">
                    {error}
                  </div>
                )}
                <div className="d-grid">
                  <CButton type="submit" color="dark" disabled={loading || isInvalid}>
                    {loading ? <CSpinner size="sm" /> : 'Войти'}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
