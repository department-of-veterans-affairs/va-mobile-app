import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, LoadingComponent, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from '../AddressSummary'

type LettersOverviewProps = {}

/**
 * Landing page for the letters flow. Shows the current address and the button to go to the letters list
 */
const LettersOverviewScreen: FC<LettersOverviewProps> = ({}) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { loading } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const onViewPressed = navigateTo('LettersList')

  const onAddressPress = navigateTo('EditAddress', {
    displayTitle: t('personalInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const addressData: Array<addressDataField> = [{ addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onAddressPress }]

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <ScrollView {...testIdProps('Letters-overview-screen')}>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.marginBetween}>
        {t('letters.overview.documents')}
      </TextView>
      <AddressSummary addressData={addressData} />
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mt={theme.dimensions.marginBetween}>
        {t('letters.overview.ifThisAddress')}
      </TextView>
      <Box mx={theme.dimensions.gutter} mt={theme.dimensions.marginBetween} mb={theme.dimensions.contentMarginBottom}>
        <VAButton
          onPress={onViewPressed}
          label={t('letters.overview.viewLetters')}
          textColor="primaryContrast"
          backgroundColor="button"
          a11yHint={t('letters.overview.viewLetters.hint')}
          testID={'view-letters-button'}
        />
      </Box>
    </ScrollView>
  )
}

export default LettersOverviewScreen
