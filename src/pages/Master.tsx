import { CAvatar, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CContainer, CLink, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableRow } from "@coreui/react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMasterById } from "../auth/mastersSlice";
import { useParams } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cibTelegramPlane, cibWhatsapp, cilBasket, cilCash, cilDiamond } from "@coreui/icons";
import moment from "moment/moment";
import { USER_ROLE_INFO } from "../const/users";
import { normalizePhone } from "../utils/common";
import { formatWorkingDays } from "../utils/date";

const Master = () => {
  const dispatch = useAppDispatch();
  const {id} = useParams<{ id?: string }>();
  const { master, masterStatus } = useAppSelector(s => s.masters);

  useEffect(() => {
    if (id) dispatch(fetchMasterById({ id }));
  }, [id, dispatch]);

  if (masterStatus === 'loading') return (
    <div 
      className="position-absolute d-flex align-items-center justify-content-center"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CSpinner />
    </div>
  )
  
  if (masterStatus === 'error') return (
    <div 
      className="position-absolute d-flex flex-column align-items-center justify-content-center"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <h2 className="text-danger">Ошибка 404</h2>
      <h4>Пользователь не найден</h4>
    </div>
  )

  return (
    <CContainer className="my-3">
      <CRow className="g-3">
        <CCol sm={12} xl={4}>
          <CRow className="g-3">
            <CCol xs={12}>
              <CCard className="rounded-1">
                <CCardBody className="d-flex flex-column">
                  <CRow>
                    <CCol xs={12} md={6} xl={12} className="d-flex">
                      <CAvatar
                        src={'/assets/master.png'}
                        size="xl"
                        className="mx-2 border border-secondary"
                      />
                      <div className="px-2 py-1">
                        <CCardTitle>{master?.fullName}</CCardTitle>
                        <CCardText>{USER_ROLE_INFO[master?.role || 0].name}</CCardText>
                      </div>
                    </CCol>
                    <CCol xs={12} md={6} xl={12} className="d-flex justify-content-center align-items-center mt-3 gap-4">
                      {master?.telegram && <CLink href={`https://t.me/${master.telegram}`} target="_blank" className="text-center">
                        <CIcon icon={cibTelegramPlane} size="sm" className="text-info" />
                        <span className="ms-1 vertical-top text-center">Написать в Telegram</span>
                      </CLink>}
                      {master?.contacts && <CLink href={`https://wa.me/${normalizePhone(master.contacts)}`} target="_blank" className="text-center">
                        <CIcon icon={cibWhatsapp} size="sm" className="text-success" />
                        <span className="ms-1 vertical-top">Написать в WhatsApp</span>
                      </CLink>}
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12}>
              <CCard className="rounded-1">
                <CCardHeader>График</CCardHeader>
                <CCardBody>
                  <CRow className="d-block px-4">
                    <span className="fw-bold p-0 me-2">Рабочие дни:</span> 
                    <span className="p-0">{formatWorkingDays(master?.workingDays)}</span>
                  </CRow>
                  <CRow className="px-2">
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12}>
              <CCard className="rounded-1">
                <CCardHeader>Информация о сотруднике</CCardHeader>
                <CCardBody>
                  <CTable>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell scope="col">Логин:</CTableDataCell>
                        <CTableDataCell>{master?.login}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell scope="col">ФИО:</CTableDataCell>
                        <CTableDataCell>{master?.fullName || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell scope="col">Город:</CTableDataCell>
                        <CTableDataCell>{master?.city || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell scope="col">Район проживания:</CTableDataCell>
                        <CTableDataCell>{master?.district || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell scope="col">Способ передвижения:</CTableDataCell>
                        <CTableDataCell>{master?.transportMode || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell scope="col">Контакты:</CTableDataCell>
                        <CTableDataCell>{master?.contacts || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell scope="col">Дата регистрации:</CTableDataCell>
                        <CTableDataCell>{moment(master?.registeredAt).local().format('D MMMM YYYY, HH:mm:ss')}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell scope="col">Последняя активность:</CTableDataCell>
                        <CTableDataCell>{moment(master?.lastActivity).local().format('D MMMM YYYY, HH:mm:ss')}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
        <CCol sm={12} xl={8}>
          <CRow className="g-3">
            <CCol xl={4} lg={4} md={12}>
              <CCard className="rounded-1 h-100 position-relative">
                <CCardBody className="d-flex flex-column justify-content-between">
                  <CIcon
                    icon={cilBasket}
                    size="xxl"
                    className="position-absolute text-primary"
                    style={{ right: '15px', top: '35px' }}
                  />
                  <CCardText className="fw-bold mb-0">Заказов всего:</CCardText>
                  <CCardText className="fw-bold mb-0 fs-5 text-secondary">60</CCardText>
                  <CCardText className="fw-bold mb-0">Заказов за текущий месяц:</CCardText>
                  <CCardText className="fw-bold mb-0 fs-5 text-secondary">23</CCardText>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xl={4} lg={4} md={12}>
              <CCard className="rounded-1 h-100 position-relative">
                <CCardBody className="d-flex flex-column justify-content-between">
                  <CIcon
                    icon={cilCash}
                    size="xxl"
                    className="position-absolute text-success"
                    style={{ right: '15px', top: '35px' }}
                  />
                  <CCardText className="fw-bold mb-0">Доход всего:</CCardText>
                  <CCardText className="fw-bold mb-0 fs-5 text-secondary">₽142 025</CCardText>
                  <CCardText className="fw-bold mb-0">Доход за текущий месяц:</CCardText>
                  <CCardText className="fw-bold mb-0 fs-5 text-secondary">₽55 900</CCardText>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xl={4} lg={4} md={12}>
              <CCard className="rounded-1 h-100 position-relative">
                <CCardBody className="d-flex flex-column justify-content-between">
                  <CIcon
                    icon={cilDiamond}
                    size="xxl"
                    className="position-absolute text-warning"
                    style={{ right: '15px', top: '35px' }}
                  />
                  <CCardText className="fw-bold mb-0">Средний чек за всё время:</CCardText>
                  <CCardText className="fw-bold mb-0 fs-5 text-secondary">₽5 462</CCardText>
                  <CCardText className="fw-bold mb-0">Средний чек за месяц:</CCardText>
                  <CCardText className="fw-bold mb-0 fs-5 text-secondary">₽5 590</CCardText>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12}>
              <CCard className="rounded-1">
                <CCardHeader>Последние заказы</CCardHeader>
                <CCardBody></CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Master