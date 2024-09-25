import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AlertWithHaptics,
  Box,
  BoxProps,
  ClickToCallPhoneNumber,
  TextView,
  VABulletList,
  VABulletListText,
  VAScrollView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

function PrescriptionHistoryNoPrescriptions() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  useEffect(() => {
    logAnalyticsEvent(Events.vama_rx_na())
  }, [])

  const alertWrapperProps: BoxProps = {
    mb: theme.dimensions.contentMarginBottom,
  }

  const medicationsNotIncludedList: Array<VABulletListText> = [
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
    <VAScrollView>
      <Box {...alertWrapperProps}>
        <AlertWithHaptics
          variant="info"
          header={t('prescriptions.notFound.title')}
          headerA11yLabel={a11yLabelVA(t('prescriptions.notFound.title'))}
          description={t('prescriptions.notFound.yourVA')}
          descriptionA11yLabel={a11yLabelVA(t('prescriptions.notFound.yourVA'))}>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={medicationsNotIncludedList} paragraphSpacing={true} />
          </Box>
          <TextView paragraphSpacing={true}>{t('prescriptions.notFound.bullets.ifYouThink')}</TextView>
          <ClickToCallPhoneNumber
            displayedText={displayedTextPhoneNumber(t('8773270022'))}
            phone={t('8773270022')}
            variant={'base'}
          />
        </AlertWithHaptics>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNoPrescriptions
