import { cilExitToApp, cilContact, cilCash, cilPeople, cilList, cilNewspaper } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CAvatar, CCol, CContainer, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFooter, CHeader, CHeaderBrand, CNavbar, CNavbarNav, CNavItem} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { USER_ROLE_INFO } from '../const/users'

const Navigation = () => {
  const { user, signOut } = useAuth()

  return (
    <>
      <CHeader className="border-bottom bg-dark p-0">
        <CContainer className="px-3">
          <CHeaderBrand role="button" className="d-flex align-items-center gap-2 m-0">
            <span className="text-white">CRM</span>
          </CHeaderBrand>
          <CDropdown>
            <CDropdownToggle color="dark d-flex align-items-center gap-2 py-3 rounded-0">
              <CNavItem className="d-flex align-items-center gap-2">
                <CAvatar src={'/assets/master.png'} size='md' className='mx-2' />
                <CCol className='d-flex align-items-start flex-column'>
                  <span className="fw-medium text-white">{user?.fullName}</span>
                  <span className="small text-white-50">{USER_ROLE_INFO[user?.role || 0].name}</span>
                </CCol>
              </CNavItem>
            </CDropdownToggle>
            <CDropdownMenu className='w-100 rounded-0'>
              <CDropdownItem as={Link} to="/profile">
                <CIcon icon={cilContact} className='me-2' />
                <span>Мой аккаунт</span>
              </CDropdownItem>
              <CDropdownItem as={Link} to="#">
                <CIcon icon={cilCash} className='me-2' />
                <span>Финансы</span>
              </CDropdownItem>
              <CDropdownItem as="button" onClick={() => signOut()}>
                <CIcon icon={cilExitToApp} className='me-2' size='sm' />
                <span>Выход</span>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CContainer>
      </CHeader>
      <CFooter className="border-bottom p-0 bg-white shadow-sm">
        <CContainer>
          <CNavbar expand="sm">
            <CContainer className='p-0'>
                <CNavbarNav className='flex-row'>
                  {user?.role === 1 && <CNavItem className='me-4'>
                    <Link to="/masters" className='fs-6'>
                      <CIcon icon={cilPeople} className='me-2' />
                      <span>Мастера</span>
                    </Link>
                  </CNavItem>}
                  <CNavItem className='me-4'>
                    <Link to="/" className='fs-6'>
                      <CIcon icon={cilList} className='me-2' />
                      <span>Заказы</span>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link to="#" className='fs-6'>
                      <CIcon icon={cilNewspaper} className='me-2' />
                      <span>Новости</span>
                    </Link>
                  </CNavItem>
                </CNavbarNav>
            </CContainer>
          </CNavbar>
        </CContainer>
      </CFooter>
    </>
  )
}

export default Navigation
