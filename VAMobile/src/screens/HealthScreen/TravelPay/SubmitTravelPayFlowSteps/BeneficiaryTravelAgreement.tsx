import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LargePanel, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function BeneficiaryTravelAgreement() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel
      title={t('travelPay.beneficiaryTravelAgreement.title')}
      rightButtonText={t('close')}
      rightButtonTestID="closeButtonID"
      testID="beneficiaryTravelAgreementID"
      children={
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <TextView testID="travelAgreementHeaderID" variant="MobileBodyBold">
            {t('travelPay.travelAgreementHeader')}
          </TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList
              paragraphSpacing
              listOfText={[
                t('travelPay.beneficiaryTravelAgreement.bulletOne'),
                t('travelPay.beneficiaryTravelAgreement.bulletTwo'),
                t('travelPay.beneficiaryTravelAgreement.bulletThree'),
                t('travelPay.beneficiaryTravelAgreement.bulletFour'),
                t('travelPay.beneficiaryTravelAgreement.bulletFive'),
              ]}
            />
          </Box>
        </Box>
      }
    />
  )
}

export default BeneficiaryTravelAgreement
