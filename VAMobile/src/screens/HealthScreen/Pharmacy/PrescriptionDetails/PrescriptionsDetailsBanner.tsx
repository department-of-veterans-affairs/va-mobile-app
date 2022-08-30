import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, CollapsibleAlert, TextView, VABulletList, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RefillStatus, RefillStatusConstants } from 'store/api/types'
import { getNumberAccessibilityLabelFromString } from '../../../../utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type PrescriptionsDetailsBannerProps = {
  /** status of prescription aka refillStatus */
  status: RefillStatus
}

const PrescriptionsDetailsBanner: FC<PrescriptionsDetailsBannerProps> = ({ status }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  if (status !== RefillStatusConstants.TRANSFERRED) {
    return <></>
  }

  const { contentMarginTop, standardMarginBetween } = theme.dimensions

  const getContent = () => {
    const bullets = [
      {
        text: t('prescription.details.banner.bullet1'),
        boldedText: ' ' + tc('or'),
        a11yLabel: t('prescription.details.banner.bullet1.a11yLabel') + ' ' + tc('or'),
      },
      {
        text: t('prescription.details.banner.bullet2'),
        boldedText: ' ' + tc('or'),
        a11yLabel: t('prescription.details.banner.bullet2.a11yLabel') + ' ' + tc('or'),
      },
      {
        text: t('prescription.details.banner.bullet3'),
        boldedText: ' ' + tc('or'),
        a11yLabel: t('prescription.details.banner.bullet3') + ' ' + tc('or'),
      },
      { text: t('prescription.details.banner.bullet4') },
    ]

    return (
      <>
        <TextView variant="MobileBody" mb={standardMarginBetween} mt={standardMarginBetween}>
          {t('prescription.details.banner.body1')}
        </TextView>
        <TextView variant="MobileBody" mb={standardMarginBetween}>
          {t('prescription.details.banner.body2')}
        </TextView>
        <Box>
          <VABulletList listOfText={bullets} />
        </Box>
        <ClickToCallPhoneNumber
          phone={tc('5418307563')}
          displayedText={`${tc('automatedPhoneSystem')} ${tc('5418307563.displayText')}`}
          a11yLabel={`${tc('automatedPhoneSystem')} ${getNumberAccessibilityLabelFromString(tc('5418307563'))}`}
        />
      </>
    )
  }
  return (
    <VAScrollView>
      <Box mt={contentMarginTop}>
        <CollapsibleAlert border="warning" headerText={t('prescription.details.banner.title')} body={getContent()} a11yLabel={t('prescription.details.banner.title')} />
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionsDetailsBanner
