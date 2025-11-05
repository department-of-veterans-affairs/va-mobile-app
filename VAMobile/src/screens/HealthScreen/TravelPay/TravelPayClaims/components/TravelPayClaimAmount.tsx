import React from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimDetails } from 'api/types'
import { AccordionCollapsible, Box, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_TRAVEL_EXPENSE_DEDUCTIBLE } = getEnv()

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

  // Only show if there's a submitted amount
  if (totalCostRequested <= 0) {
    return null
  }

  return (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <TextView variant="MobileBodyBold" accessibilityRole="header" testID="travelPayClaimAmountTitleTestID">
        {t('travelPay.claimDetails.amount.title')}
      </TextView>

      <TextView variant="MobileBody" mb={0} testID="travelPayClaimAmountSubmittedTestID">
        {t('travelPay.claimDetails.amount.submitted', {
          amount: totalCostRequested.toFixed(2),
        })}
      </TextView>

      {reimbursementAmount > 0 && (
        <TextView variant="MobileBody" mb={0} testID="travelPayClaimAmountReimbursementTestID">
          {t('travelPay.claimDetails.amount.reimbursement', {
            amount: reimbursementAmount.toFixed(2),
          })}
        </TextView>
      )}

      {reimbursementAmount > 0 && totalCostRequested !== reimbursementAmount && (
        // <Box ml={-theme.dimensions.cardPadding} mb={-20}>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <AccordionCollapsible
            header={
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header"
                testID="travelPayAmountDifferenceTitleTestID">
                {t('travelPay.claimDetails.amount.reimbursement.difference.title')}
              </TextView>
            }
            expandedContent={
              <Box
                backgroundColor="contentBox"
                pr={theme.dimensions.standardMarginBetween}
                py={theme.dimensions.condensedMarginBetween}>
                <Box flexDirection="row" flexWrap="wrap">
                  <TextView variant="MobileBody" testID="travelPayAmountDifferenceDescriptionPart1TestID">
                    {t('travelPay.claimDetails.amount.reimbursement.difference.description.part1')}
                  </TextView>
                  <LinkWithAnalytics
                    type="url"
                    url={LINK_URL_TRAVEL_EXPENSE_DEDUCTIBLE}
                    text={t('travelPay.claimDetails.amount.reimbursement.difference.description.link.text')}
                    a11yLabel={a11yLabelVA(
                      t('travelPay.claimDetails.amount.reimbursement.difference.description.link.text'),
                    )}
                    testID="travelPayDeductibleInfoLinkTestID"
                    icon="no icon"
                  />
                  <Box>
                    <TextView variant="MobileBody">
                      {t('travelPay.claimDetails.amount.reimbursement.difference.description.part2')}
                    </TextView>
                  </Box>
                </Box>
              </Box>
            }
            testID="travelPayAmountDifferenceTestID"
          />
        </Box>
      )}
    </Box>
  )
}

export default TravelPayClaimAmount
