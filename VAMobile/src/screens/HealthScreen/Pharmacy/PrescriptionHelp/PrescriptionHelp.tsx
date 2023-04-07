import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, ClosePanelButton, LargePanel, TextView, VABulletList, VABulletListText } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { usePanelHeaderStyles, useTheme } from 'utils/hooks'

type PrescriptionHelpProps = StackScreenProps<HealthStackParamList, 'PrescriptionHelp'>

const PrescriptionHelp: FC<PrescriptionHelpProps> = ({ navigation }) => {
  const theme = useTheme()
  const headerStyle = usePanelHeaderStyles()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const { gutter, contentMarginTop, contentMarginBottom, standardMarginBetween } = theme.dimensions
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
      <Box mx={gutter} mt={contentMarginTop} mb={contentMarginBottom}>
        <TextView variant="MobileBodyBold" paragraphSpacing={true}>
          {t('prescription.help.header')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('prescription.help.listHeader')}
        </TextView>
        <Box my={standardMarginBetween}>
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
