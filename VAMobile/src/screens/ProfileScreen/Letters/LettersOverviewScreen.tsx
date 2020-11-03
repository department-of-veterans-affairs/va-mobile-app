import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { TextView, VAButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from '../AddressSummary'

type LettersOverviewProps = {}

const LettersOverviewScreen: FC<LettersOverviewProps> = ({}) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const onViewPressed = (): void => {}

  const onAddressPress = navigateTo('EditAddress', {
    displayTitle: t('personalInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const addressData: Array<addressDataField> = [{ addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onAddressPress }]

  return (
    <ScrollView {...testIdProps('Letters-overview-screen')}>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} my={theme.dimensions.marginBetween}>
        {t('letters.overview.documents')}
      </TextView>
      <AddressSummary addressData={addressData} />
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mt={theme.dimensions.marginBetween}>
        {t('letters.overview.ifThisAddress')}
      </TextView>
      <VAButton onPress={onViewPressed} label={t('letters.overview.viewLetters')} textColor="primaryContrast" backgroundColor="button" />
    </ScrollView>
  )
}

export default LettersOverviewScreen
