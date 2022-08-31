import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { RequestAppointmentState } from 'store/slices'
import { RootState } from 'store'
import { useRouteNavigation } from 'utils/hooks'

type CCClosestCityScreen = StackScreenProps<AppointmentFlowModalStackParamList, 'CCClosestCityScreen'>

const CCClosestCityScreen: FC<CCClosestCityScreen> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { userFacilities, ccSupportedFacilities } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const navigateTo = useRouteNavigation()
  const [selectedCity, setSelectedCity] = useState<string>()

  const navigateToPreferredLanguage = navigateTo('CCPreferredLanguageScreen')

  const onCitySelectionChanged = (facility: string) => {
    setSelectedCity(facility)
  }

  const getClosestCityOptions = () => {
    const facilityOptions: Array<radioOption<string>> = []
    const ccFacilities = userFacilities.filter((item) => ccSupportedFacilities.includes(item.id))

    for (const facility of ccFacilities) {
      facilityOptions.push({
        value: facility.id,
        labelKey: `${facility.city}, ${facility.state}`,
      })
    }
    return facilityOptions
  }

  const onContinue = () => {
    navigateToPreferredLanguage()
  }

  return (
    <AppointmentFlowLayout
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={onContinue}>
      <AppointmentFlowTitleSection title={t('requestAppointment.whatIsClosestCity')} />
      <RadioGroup options={getClosestCityOptions()} onChange={onCitySelectionChanged} value={selectedCity} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default CCClosestCityScreen
