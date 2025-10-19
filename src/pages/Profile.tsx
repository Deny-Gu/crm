import { CAvatar, CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CContainer, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableRow } from "@coreui/react";
import { useAuth } from "../providers/AuthProvider";
import DatePicker, { DateObject } from 'react-multi-date-picker'
import 'react-multi-date-picker/styles/layouts/mobile.css'
import { useState } from "react";
import "./dark.css"
import CIcon from "@coreui/icons-react";
import { cilBasket, cilCash, cilDiamond } from "@coreui/icons";
import moment from "moment/moment";
import { USER_ROLE_INFO } from "../const/users";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateWorkingDays } from "../auth/userSlice";
import { isoToPicker, pickerToIso } from "../utils/date";

const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

const months = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек"
]

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth()
  const [workingDays, setWorkingDays] = useState<DateObject[]>(isoToPicker(user?.workingDays || []))

  const status = useAppSelector(state => state.user.status);

  const handleClickSaveWorkingDays = () => {
    if (!user) return;
    const payload = pickerToIso(workingDays)
    dispatch(updateWorkingDays({ userId: user.id, workingDays: payload }))
  };

  const isAdmin = user?.role === 1

  const renderCardOrders = () => {
    return (
      <CCard className="rounded-1">
        <CCardHeader>Последние заказы</CCardHeader>
        <CCardBody></CCardBody>
      </CCard>
    )
  }

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
                        className="mx-2 mt-3 border border-secondary"
                      />
                      <div className="px-2 py-4">
                        <CCardTitle>{user?.fullName}</CCardTitle>
                        <CCardText>{USER_ROLE_INFO[user?.role || 0].name}</CCardText>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
            {!isAdmin && 
              <>
                <CCol xs={12}>
                  <CCard className="rounded-1">
                    <CCardHeader>График</CCardHeader>
                    <CCardBody>
                      <CRow className="px-4 mb-2 fw-bold">Отметьте Ваши рабочие дни:</CRow>
                      <CRow className="px-2">
                        <DatePicker
                          multiple
                          value={workingDays}
                          onChange={(v) => setWorkingDays(v as DateObject[])}
                          weekDays={weekDays}
                          months={months}
                          weekStartDayIndex={1}
                          format="DD.MM.YYYY"
                          calendarPosition="bottom-start"
                          minDate={new Date().setHours(0, 0, 0, 0)}
                          style={{ width: '100%', height: 30 }}
                          placeholder="Выберите даты"
                          className="dark"
                        />
                        <CButton color="dark" size="sm" className="w-50 ms-2 mt-2" onClick={handleClickSaveWorkingDays} disabled={status === 'loading'}>
                          {status === 'loading' ? <CSpinner size="sm" /> : 'Сохранить'}
                        </CButton>
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
                            <CTableDataCell>{user?.login}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell scope="col">ФИО:</CTableDataCell>
                            <CTableDataCell>{user?.fullName || '-'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell scope="col">Город:</CTableDataCell>
                            <CTableDataCell>{user?.city || '-'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell scope="col">Район проживания:</CTableDataCell>
                            <CTableDataCell>{user?.district || '-'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell scope="col">Способ передвижения:</CTableDataCell>
                            <CTableDataCell>{user?.transportMode || '-'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell scope="col">Контакты:</CTableDataCell>
                            <CTableDataCell>{user?.contacts || '-'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell scope="col">Дата регистрации:</CTableDataCell>
                            <CTableDataCell>{moment(user?.registeredAt).local().format('D MMMM YYYY, HH:mm:ss')}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell scope="col">Последняя активность:</CTableDataCell>
                            <CTableDataCell>{moment(user?.lastActivity).local().format('D MMMM YYYY, HH:mm:ss')}</CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                </CCol>
              </>
            }
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
            {!isAdmin && <CCol xs={12}>
              <CCard className="rounded-1">
                <CCardHeader>Последние заказы</CCardHeader>
                <CCardBody></CCardBody>
              </CCard>
            </CCol>}
          </CRow>
        </CCol>
      </CRow>
      {isAdmin && <CRow className="mt-3">
        <CCol>
          {renderCardOrders()}
        </CCol>
      </CRow>}
    </CContainer>
  )
}

export default Profile;