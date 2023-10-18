import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, LargePanel, TextView, VABulletList, VABulletListText } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

type PrescriptionHelpProps = StackScreenProps<HealthStackParamList, 'PrescriptionHelp'>

const PrescriptionHelp: FC<PrescriptionHelpProps> = () => {
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
    <LargePanel testID="PrescriptionsHelpTestID" title={t('prescriptionsHelp')} rightButtonText={t('close')}>
      <Box mx={gutter} mb={contentMarginBottom}>
        <TextView variant="MobileBodyBold">{t('prescription.help.header')}</TextView>
        <TextView mt={condensedMarginBetween} variant="MobileBody" paragraphSpacing={true}>
          {t('prescription.help.listHeader')}
        </TextView>
        <VABulletList listOfText={medicationNoIncludedList} />
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('prescription.help.footer'))}>
          {t('prescription.help.footer')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default PrescriptionHelp
