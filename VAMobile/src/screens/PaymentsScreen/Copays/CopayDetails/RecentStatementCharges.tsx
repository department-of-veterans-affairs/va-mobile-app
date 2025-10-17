import React from 'react'
import { useTranslation } from 'react-i18next'

import { MedicalCopayDetail, MedicalCopayRecord } from 'api/types'
import { AccordionCollapsible, BorderColorVariant, Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { formatDate } from 'utils/copays'
import { useTheme } from 'utils/hooks'

function RecentStatementCharges({ copay }: { copay: MedicalCopayRecord }) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const chargeBoxProps = {
    borderTopWidth: theme.dimensions.borderWidth,
    borderColor: theme.colors.border.divider as BorderColorVariant,
    py: theme.dimensions.standardMarginBetween,
  }

  const charges = copay.details.filter((charge) => !charge.pDTransDescOutput?.startsWith('&nbsp;'))

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getDate = (detail: MedicalCopayDetail): string | null | undefined => {
    if (detail.pDDatePostedOutput) return detail.pDDatePostedOutput
    if (detail.pDTransDesc?.toLowerCase().includes('interest/adm')) {
      return copay.pSStatementDateOutput
    }
    return null
  }

  const getReference = (detail: MedicalCopayDetail): string | null | undefined => {
    if (detail.pDRefNo) return detail.pDRefNo
    if (detail.pDTransDesc?.toLowerCase().includes('interest/adm')) {
      return copay.pSStatementVal
    }
    return null
  }

  const renderCharge = (detail: MedicalCopayDetail, index: number) => {
    const date = getDate(detail)
    const reference = getReference(detail)

    return (
      <Box key={`${detail.pDDatePosted}-${index}`} {...chargeBoxProps}>
        {date && (
          <TextView variant="vadsFontBodySmall" mb={theme.dimensions.condensedMarginBetween}>
            {formatDate(date)}
          </TextView>
        )}
        <TextView variant="vadsFontHeadingXsmall">{detail.pDTransDescOutput?.replace(/&nbsp;/g, ' ')}</TextView>
        {reference && (
          <TextView variant="vadsFontBodyXsmall">
            {t('copays.recentCharges.billingReference')} {reference}
          </TextView>
        )}
        <TextView>{formatCurrency(detail.pDTransAmt)}</TextView>
      </Box>
    )
  }

  const expandedContent = (
    <Box>
      <Box py={theme.dimensions.standardMarginBetween}>
        <TextView>This statement shows your current charges.</TextView>
      </Box>
      <Box {...chargeBoxProps}>
        <TextView variant="vadsFontHeadingXsmall">{t('copays.recentCharges.previousBalance')}</TextView>
        <TextView>{formatCurrency(copay.pHPrevBal)}</TextView>
      </Box>
      {charges.map((detail, index) => renderCharge(detail, index))}
      <Box
        borderTopWidth={theme.dimensions.borderWidth}
        borderColor={theme.colors.border.divider as BorderColorVariant}
        pt={theme.dimensions.standardMarginBetween}>
        <TextView variant="vadsFontHeadingXsmall">{t('copays.currentBalance')}</TextView>
        <TextView>{formatCurrency(copay.pHNewBalance)}</TextView>
      </Box>
    </Box>
  )

  return (
    <Box>
      <AccordionCollapsible
        header={<TextView variant={'MobileBodyBold'}>{t('copays.recentCharges')}</TextView>}
        expandedContent={expandedContent}
        expandedInitialValue={false}
      />
    </Box>
  )
}

export default RecentStatementCharges
