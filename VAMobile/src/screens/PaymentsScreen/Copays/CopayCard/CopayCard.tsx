import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { MedicalCopayRecord } from 'api/types/MedicalCopayData'
import { Box, MultiTouchCard, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import ResolveCopayButton from 'screens/PaymentsScreen/Copays/ResolveCopay/ResolveCopayButton'
import { DUE_DATE_DAYS, calcDueDate, formatDate, getMedicalCenterNameByID, verifyCurrentBalance } from 'utils/copays'
import { numberToUSDollars } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

interface CopayCardProps {
  copay: MedicalCopayRecord
  index: number
  totalCopays: number
}

export const getCopayInfo = (
  copayRecord: MedicalCopayRecord,
): { facilityName: string; balance: number | undefined; date: string } => {
  return {
    facilityName: getMedicalCenterNameByID(copayRecord.station.facilitYNum),
    balance: copayRecord.pHAmtDue,
    date: copayRecord.pSStatementDateOutput || '',
  }
}

function CopayCard({ copay, index, totalCopays }: CopayCardProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const copayDetailsClicked = (copayRecord: MedicalCopayRecord) => {
    navigateTo('CopayDetails', { copay: copayRecord })
  }

  const copayInfo = getCopayInfo(copay)

  const detailsPressableProps: PressableProps = {
    onPress: () => copayDetailsClicked(copay),
    accessible: true,
    accessibilityRole: 'link',
    accessibilityLabel: t('copays.reviewDetails'),
  }

  const renderSummary = () => {
    const isCurrentBalance = verifyCurrentBalance(copayInfo.date)

    // Calculate formatted dates once to avoid redundant operations
    const formattedDate = formatDate(copayInfo.date)
    const formattedDueDate = calcDueDate(copayInfo.date, DUE_DATE_DAYS) // calcDueDate already returns formatted string

    return isCurrentBalance ? (
      <Trans
        i18nKey={'copays.summary.current'}
        components={{
          // This handles bolding text
          bold: <TextView variant="HelperTextBold" />,
        }}
        values={{
          date: formattedDate,
          thirtyDays: formattedDueDate,
        }}
      />
    ) : (
      <Trans
        i18nKey={'copays.summary.pastDue'}
        components={{
          // This handles bolding text
          bold: <TextView variant="HelperTextBold" />,
        }}
        values={{
          date: formattedDate,
        }}
      />
    )
  }

  const mainContent = (
    <>
      {/* Header */}
      <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBodyBold">
        {copayInfo.facilityName}
      </TextView>
      {/* Balance */}
      <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
        <Trans
          i18nKey="copays.currentBalance.amount"
          components={{ bold: <TextView variant="MobileBodyBold" /> }}
          values={{ amount: numberToUSDollars(copayInfo.balance ?? 0) }}
        />
      </TextView>
      {/* Summary with icon */}
      <Box flexDirection="row">
        <Icon name="Warning" fill={theme.colors.icon.warning} />
        <Box ml={theme.dimensions.condensedMarginBetween} flexShrink={1}>
          <TextView variant="HelperText">{renderSummary()}</TextView>
        </Box>
      </Box>
      {/* Review details link */}
      <Pressable {...detailsPressableProps}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          minHeight={theme.dimensions.touchableMinHeight}
          py={theme.dimensions.buttonPadding}>
          <TextView flex={1} variant={'HelperTextBold'} color={'link'}>
            {t('copays.reviewDetails')}
          </TextView>
          <Icon
            name={'ChevronRight'}
            fill={theme.colors.icon.chevronListItem}
            width={theme.dimensions.chevronListItemWidth}
            height={theme.dimensions.chevronListItemHeight}
          />
        </Box>
      </Pressable>
      {/* Resolve copay button */}
      <ResolveCopayButton copay={copay} />
    </>
  )

  return (
    <Box pb={theme.dimensions.condensedMarginBetween}>
      <MultiTouchCard
        orderIdentifier={t('copays.orderIdentifier', { idx: index + 1, total: totalCopays })}
        mainContent={mainContent}
      />
    </Box>
  )
}

export default CopayCard
