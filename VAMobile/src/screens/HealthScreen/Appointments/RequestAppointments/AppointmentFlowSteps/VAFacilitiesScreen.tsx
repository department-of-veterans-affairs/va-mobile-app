import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { Box, PickerItem, RadioGroup, TextView, VAModalPicker, radioOption } from 'components'
import { FACILITY_FILTER, FacilitiesFilterType } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { States } from 'constants/states'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'utils/hooks/useTheme'

type VAFacilitiesScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'VAFacilitiesScreen'>

const VAFacilitiesScreen: FC<VAFacilitiesScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const [sortOption, setSortOption] = useState<FacilitiesFilterType>(FACILITY_FILTER.home)
  const [selectedFacility, setSelectedFacility] = useState<string>()

  const navigateToVisitType = navigateTo('VisitTypeSelectionScreen')

  const { userFacilities, vaEligibleTypeOfCares, appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)

  const getSortOptions = (): Array<PickerItem> => {
    const options: Array<PickerItem> = [
      { label: t('requestAppointment.sortByAppointment'), value: FACILITY_FILTER.appointments },
      { label: t('requestAppointment.sortByHome'), value: FACILITY_FILTER.home },
      { label: t('requestAppointment.sortByAlpha'), value: FACILITY_FILTER.alphabetical },
    ]
    return options
  }

  const onSortByChange = (sortValue: string) => {
    setSortOption(sortValue as FacilitiesFilterType)
  }

  const onFacilitySelectionChanged = (facility: string) => {
    setSelectedFacility(facility)
  }

  const getFacilityOptions = () => {
    const facilityOptions: Array<radioOption<string>> = []
    const care = vaEligibleTypeOfCares.find((item) => item.name === appointmentFlowFormData.serviceType)

    for (const facility of userFacilities) {
      const milesString = `${parseFloat(facility.miles).toFixed(2)} miles`
      const cityStateString = `${facility.city}, ${facility.state}`

      facilityOptions.push({
        value: facility.id,
        labelKey: facility.name,
        additionalLabelText: [cityStateString, milesString],
        a11yLabel: `${facility.name}, ${facility.city} ${States.find((item) => item.value === facility.state)?.label}, ${milesString}`,
        // remove radio button if not eligible for online request
        notSelectableRadioBtn: !care?.directEligibleFacilities.includes(facility.id) && !care?.requestEligibleFacilities.includes(facility.id),
      })
    }
    return facilityOptions
  }

  const onContinue = () => {
    navigateToVisitType()
  }

  return (
    <AppointmentFlowLayout
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={onContinue}
      linkText={t('requestAppointment.facilityNotListed')}>
      <AppointmentFlowTitleSection title={t('requestAppointment.whichFacility')} titleA11yLabel={t('requestAppointment.whichFacilityLabel')} />
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
        <TextView variant="HelperTextBold" mb={theme.dimensions.condensedMarginBetween}>
          {t('requestAppointment.sortFacilities')}
        </TextView>
        <VAModalPicker selectedValue={sortOption} onSelectionChange={onSortByChange} pickerOptions={getSortOptions()} />
      </Box>
      <RadioGroup options={getFacilityOptions()} onChange={onFacilitySelectionChanged} value={selectedFacility} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default VAFacilitiesScreen
