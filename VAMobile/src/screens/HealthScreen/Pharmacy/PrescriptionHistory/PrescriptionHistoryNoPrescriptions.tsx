import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, BoxProps, ClickToCallPhoneNumber, TextView, VABulletList, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const PrescriptionHistoryNoPrescriptions: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { standardMarginBetween } = theme?.dimensions?

  const alertWrapperProps: BoxProps = {
    mt: standardMarginBetween,
    mb: theme?.dimensions?.contentMarginBottom,
  }

  const bullets: string[] = [
    t('prescriptions.notFound.bullets.one'),
    t('prescriptions.notFound.bullets.two'),
    t('prescriptions.notFound.bullets.three'),
    t('prescriptions.notFound.bullets.four'),
  ]

  return (
    <VAScrollView>
      <Box {...alertWrapperProps}>
        <AlertBox border={'informational'} title={t('prescriptions.notFound.title')} titleA11yLabel={t('prescriptions.notFound.title.a11y')}>
          <TextView pt={standardMarginBetween} accessibilityLabel={t('prescriptions.notFound.yourVA.a11y')}>
            {t('prescriptions.notFound.yourVA')}
          </TextView>
          <Box pt={standardMarginBetween}>
            <VABulletList listOfText={bullets} />
          </Box>
          <TextView pt={standardMarginBetween}>{t('prescriptions.notFound.bullets.ifYouThink')}</TextView>
          <ClickToCallPhoneNumber displayedText={tc('8773270022.displayText')} phone={tc('8773270022')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNoPrescriptions
