import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { Box, PickerItem, VAModalPicker, VAModalPickerProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { usePreferredLanguageList } from 'utils/requestAppointments'

type CCPreferredLanguageScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'CCPreferredLanguageScreen'>

const CCPreferredLanguageScreen: FC<CCPreferredLanguageScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { preferredLanguage } = appointmentFlowFormData
  const listOfLanguagePref = usePreferredLanguageList()

  const [noLanguageSelectedError, setNoLanguageSelectedError] = useState(false)

  const getPickerOptions = (): Array<PickerItem> => {
    return map(listOfLanguagePref, (language) => {
      return {
        label: language,
        value: language,
      }
    })
  }

  const setValuesOnPickerSelect = (selectedValue: string): void => {
    if (selectedValue) {
      setNoLanguageSelectedError(false)
      dispatch(updateFormData({ preferredLanguage: selectedValue }))
    }
  }

  const pickerProps: VAModalPickerProps = {
    labelKey: 'health:requestAppointments.langPrefModalTitle',
    selectedValue: preferredLanguage || '',
    onSelectionChange: setValuesOnPickerSelect,
    pickerOptions: getPickerOptions(),
  }

  const onContinue = () => {
    if (!preferredLanguage) {
      setNoLanguageSelectedError(true)
    }
  }

  return (
    <AppointmentFlowLayout
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={onContinue}>
      <AppointmentFlowTitleSection
        title={t('requestAppointments.langPrefPageTitle')}
        error={noLanguageSelectedError}
        errorMessage={t('requestAppointments.langPrefNoSelectedError')}
      />
      <Box mx={theme.dimensions.gutter}>
        <VAModalPicker {...pickerProps} />
      </Box>
    </AppointmentFlowLayout>
  )
}

export default CCPreferredLanguageScreen
