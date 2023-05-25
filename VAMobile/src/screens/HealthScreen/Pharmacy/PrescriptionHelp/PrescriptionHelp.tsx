import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, ClosePanelButton, LargePanel, TextView, VABulletList, VABulletListText } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { usePanelHeaderStyles } from 'utils/hooks'
import { useTheme } from 'utils/hooks'

type PrescriptionHelpProps = StackScreenProps<HealthStackParamList, 'PrescriptionHelp'>

const PrescriptionHelp: FC<PrescriptionHelpProps> = ({ navigation }) => {
  const theme = useTheme()
  const headerStyle = usePanelHeaderStyles()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const medicationNoIncludedList: Array<VABulletListText> = [
    {
      text: t('prescription.help.item1'),
    },
    {
      text: t('prescription.help.item2'),
      a11yLabel: t('prescription.help.item2.a11yLabel'),
    },
    {
      text: t('prescription.help.item3'),
    },
  ]

  useEffect(() => {
    navigation.setOptions({
      ...headerStyle,
      headerLeft: (props) => <ClosePanelButton buttonText={tc('close')} onPress={props.onPress} buttonTextColor={'showAll'} />,
    })
  }, [navigation, headerStyle, tc])

  return (
    <LargePanel title={tc('prescriptionsHelp')} rightButtonText={tc('close')}>
      <Box mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextView variant="MobileBodyBold">{t('prescription.help.header')}</TextView>
        <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('prescription.help.listHeader')}
        </TextView>
        <Box my={theme.dimensions.standardMarginBetween}>
          <VABulletList listOfText={medicationNoIncludedList} />
        </Box>
        <TextView variant="MobileBody" accessibilityLabel={t('prescription.help.footer.a11yLabel')}>
          {t('prescription.help.footer')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default PrescriptionHelp
