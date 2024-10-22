import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, LargePanel, TextView, VABulletList, VABulletListText } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

import { HealthStackParamList } from '../../HealthStackScreens'

type PrescriptionHelpProps = StackScreenProps<HealthStackParamList, 'PrescriptionHelp'>

function PrescriptionHelp({}: PrescriptionHelpProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { gutter, contentMarginBottom, condensedMarginBetween } = theme.dimensions
  const medicationNoIncludedList: Array<VABulletListText> = [
    {
      text: t('prescription.help.item1'),
      a11yLabel: a11yLabelVA(t('prescription.help.item1')),
    },
    {
      text: t('prescription.help.item2'),
      a11yLabel: a11yLabelVA(t('prescription.help.item2')),
    },
    {
      text: t('prescription.help.item3'),
    },
    {
      text: t('prescription.help.item4'),
      a11yLabel: t('prescription.help.item4.a11yLabel'),
    },
    {
      text: t('prescription.help.item5'),
    },
  ]

  return (
    <LargePanel
      testID="PrescriptionsHelpTestID"
      title={t('prescriptionsHelp')}
      rightButtonText={t('close')}
      rightButtonTestID="prescriptionsBackTestID">
      <Box mx={gutter} mb={contentMarginBottom}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('prescription.help.header')}
        </TextView>
        <TextView mt={condensedMarginBetween} variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
          {t('prescription.help.listHeader')}
        </TextView>
        <VABulletList listOfText={medicationNoIncludedList} paragraphSpacing={true} />
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('prescription.help.footer'))}>
          {t('prescription.help.footer')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default PrescriptionHelp
