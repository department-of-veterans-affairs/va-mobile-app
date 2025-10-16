import React from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimDetails } from 'api/types'
import { Box, CollapsibleView, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

type TravelPayClaimAmountProps = {
  /** The claim details data */
  claimDetails: TravelPayClaimDetails
}

/**
 * Component that displays the amount information for a travel pay claim
 * Shows submitted amount and reimbursement amount (if \> 0)
 */
function TravelPayClaimAmount({ claimDetails }: TravelPayClaimAmountProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { totalCostRequested, reimbursementAmount } = claimDetails

  const borderBoxStyle = {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.icon.chevronCollapsible,
  }

  // Only show if there's a submitted amount
  if (totalCostRequested <= 0) {
    return null
  }

  return (
    <Box mt={theme.dimensions.condensedMarginBetween}>
      <TextView variant="MobileBodyBold">{t('travelPay.claimDetails.amount.title')}</TextView>

      <TextView variant="MobileBody" mb={0}>
        {t('travelPay.claimDetails.amount.submitted', {
          amount: totalCostRequested.toFixed(2),
        })}
      </TextView>

      {reimbursementAmount > 0 && (
        <TextView variant="MobileBody" mb={0}>
          {t('travelPay.claimDetails.amount.reimbursement', {
            amount: reimbursementAmount.toFixed(2),
          })}
        </TextView>
      )}

      {reimbursementAmount > 0 && totalCostRequested !== reimbursementAmount && (
        <CollapsibleView
          text={t('travelPay.claimDetails.amount.reimbursement.difference.title')}
          testID="travelPayAmountDifferenceTestID"
          showInTextArea={false}>
          <Box
            style={borderBoxStyle}
            backgroundColor="contentBox"
            pl={theme.dimensions.standardMarginBetween}
            pr={theme.dimensions.standardMarginBetween}
            py={theme.dimensions.condensedMarginBetween}>
            <TextView variant="MobileBody">
              {t('travelPay.claimDetails.amount.reimbursement.difference.description.part1')}{' '}
            </TextView>
            <Box>
              <LinkWithAnalytics
                type="url"
                url={t('travelPay.claimDetails.amount.reimbursement.difference.description.link.url')}
                text={t('travelPay.claimDetails.amount.reimbursement.difference.description.link.text')}
                a11yLabel={a11yLabelVA(
                  t('travelPay.claimDetails.amount.reimbursement.difference.description.link.text'),
                )}
                testID="travelPayDeductibleInfoLinkTestID"
              />
            </Box>
            <TextView variant="MobileBody">
              {t('travelPay.claimDetails.amount.reimbursement.difference.description.part2')}
            </TextView>
          </Box>
        </CollapsibleView>
      )}
    </Box>
  )
}

export default TravelPayClaimAmount
