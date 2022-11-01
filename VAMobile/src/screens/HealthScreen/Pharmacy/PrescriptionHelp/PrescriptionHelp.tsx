import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, ClosePanelButton, TextView, VABulletList, VABulletListText, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { usePanelHeaderStyles, useTheme } from 'utils/hooks'

type PrescriptionHelpProps = StackScreenProps<HealthStackParamList, 'PrescriptionHelp'>

const PrescriptionHelp: FC<PrescriptionHelpProps> = ({ navigation }) => {
  const theme = useTheme()
  const headerStyle = usePanelHeaderStyles()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const { gutter, contentMarginTop, contentMarginBottom, condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const medicationNoIncludedList: Array<VABulletListText> = [
    {
      text: t('prescription.help.item1'),
    },
    {
      text: t('prescription.help.item2'),
    },
    {
      text: t('prescription.help.item3'),
      a11yLabel: t('prescription.help.item3.a11yLabel'),
    },
    {
      text: t('prescription.help.item4'),
    },
  ]

  useEffect(() => {
    navigation.setOptions({
      ...headerStyle,
      headerLeft: (props) => <ClosePanelButton buttonText={tc('close')} onPress={props.onPress} buttonTextColor={'showAll'} />,
    })
  }, [navigation, headerStyle, tc])

  return (
    <VAScrollView backgroundColor={'panelHeader'}>
      <Box mx={gutter} mt={contentMarginTop} mb={contentMarginBottom}>
        <TextView variant="MobileBodyBold">{t('prescription.help.header')}</TextView>
        <TextView mt={condensedMarginBetween} variant="MobileBody">
          {t('prescription.help.listHeader')}
        </TextView>
        <Box my={standardMarginBetween}>
          <VABulletList listOfText={medicationNoIncludedList} />
        </Box>
        <TextView variant="MobileBody" accessibilityLabel={t('prescription.help.footer.a11yLabel')}>
          {t('prescription.help.footer')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHelp
