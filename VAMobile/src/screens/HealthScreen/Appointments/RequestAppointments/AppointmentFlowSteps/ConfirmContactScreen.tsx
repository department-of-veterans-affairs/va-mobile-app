import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTextInputWithAlert, AppointmentFlowTitleSection, PreferredTimeComponent } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { EMAIL_REGEX_EXP, MAX_DIGITS, MAX_DIGITS_AFTER_FORMAT } from 'constants/common'
import { MethodOfContactType, PhoneEmailType, TimesForPhoneCallType } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState } from 'store/slices'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'

import { formatPhoneNumber, getNumbersFromString } from 'utils/formattingUtils'
import { getFormattedPhoneNumber } from 'utils/common'
import { useAppDispatch, useTheme } from 'utils/hooks'

type ConfirmContactScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'ConfirmContactScreen'>

const ConfirmContactScreen: FC<ConfirmContactScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { contact, preferredTimesForPhoneCall } = appointmentFlowFormData
  const { telecom } = contact || {}
  const { mobilePhoneNumber, contactEmail } = profile || {}

  const email = telecom?.find((item) => item.type === 'email')?.value ?? contactEmail?.emailAddress
  const phone = telecom?.find((item) => item.type === 'phone')?.value ?? (mobilePhoneNumber ? getFormattedPhoneNumber(mobilePhoneNumber) : '')

  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [timePrefError, setTimePrefError] = useState('')

  const onPhoneChange = (val: string, typeOfContact: PhoneEmailType) => {
    setPhoneError('')
    setPhoneOrEmailValue(val, typeOfContact)
  }

  const onEmailChange = (val: string, typeOfContact: PhoneEmailType) => {
    setEmailError('')
    setPhoneOrEmailValue(val, typeOfContact)
  }

  const validateEmail = () => {
    const validEmail = EMAIL_REGEX_EXP

    if (!email) {
      setEmailError(t('requestAppointment.confirmContactYourEmailEmptyError'))
    } else {
      if (!validEmail.test(email)) {
        setEmailError(tc('editEmail.fieldError'))
      }
    }
  }

  const validatePhone = () => {
    if (!phone) {
      setPhoneError(t('requestAppointment.confirmContactYourPhoneEmptyError'))
    } else {
      const onlyDigits = getNumbersFromString(phone)

      if (onlyDigits.length === MAX_DIGITS) {
        const formattedPhoneNumber = formatPhoneNumber(onlyDigits)
        setPhoneOrEmailValue(formattedPhoneNumber, 'phone')
      } else {
        setPhoneOrEmailValue(onlyDigits, 'phone')
        setPhoneError(tc('editPhoneNumber.numberFieldError'))
      }
    }
  }

  const setPhoneOrEmailValue = (data: string, typeOfContact: PhoneEmailType) => {
    let value: MethodOfContactType | undefined
    const contactInfo: Array<MethodOfContactType> | undefined = []

    if (telecom) {
      value = telecom.find((item) => item.type !== typeOfContact)
    }

    if (value) {
      contactInfo?.push(value)
    }

    contactInfo.push({ type: typeOfContact, value: data })
    dispatch(updateFormData({ contact: { telecom: contactInfo } }))
  }

  const onTimePreferredChanged = (val: Array<TimesForPhoneCallType>) => {
    setTimePrefError('')
    let prefTimes: Array<TimesForPhoneCallType> | undefined
    if (val.length > 0) {
      prefTimes = val
    }

    dispatch(updateFormData({ preferredTimesForPhoneCall: prefTimes }))
  }

  const onContinue = () => {
    validateEmail()
    validatePhone()

    if (!preferredTimesForPhoneCall || preferredTimesForPhoneCall.length === 0) {
      setTimePrefError(t('requestAppointment.timeNotSelected'))
    }

    if (!emailError && !phoneError && email && phone && preferredTimesForPhoneCall) {
    }
  }

  return (
    <AppointmentFlowLayout
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={onContinue}>
      <AppointmentFlowTitleSection title={t('requestAppointment.confirmContactTitle')} extraInformationText={t('requestAppointment.confirmContactAdditionalText')} />

      <AppointmentFlowTextInputWithAlert
        mx={theme.dimensions.gutter}
        inputType={'phone'}
        inputLabel={t('requestAppointment.confirmContactYourPhone')}
        onChange={(e) => {
          onPhoneChange(e, 'phone')
        }}
        mb={theme.dimensions.standardMarginBetween}
        value={phone}
        maxLength={MAX_DIGITS_AFTER_FORMAT}
        validationFunc={validatePhone}
        errorMessage={phoneError}
      />
      <AppointmentFlowTextInputWithAlert
        mx={theme.dimensions.gutter}
        inputType={'email'}
        mb={theme.dimensions.standardMarginBetween}
        inputLabel={t('requestAppointment.confirmContactYourEmail')}
        onChange={(e) => {
          onEmailChange(e, 'email')
        }}
        validationFunc={validateEmail}
        errorMessage={emailError}
        value={email}
      />
      <PreferredTimeComponent
        onChange={onTimePreferredChanged}
        selectedTimes={preferredTimesForPhoneCall}
        selectionTitle={t('requestAppointment.timePrefTitle')}
        errorMessage={timePrefError}
      />
    </AppointmentFlowLayout>
  )
}

export default ConfirmContactScreen
