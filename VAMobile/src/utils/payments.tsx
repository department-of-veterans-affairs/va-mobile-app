import React, { ReactNode } from 'react'

import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { forEach, groupBy, keys, map } from 'underscore'

import { PaymentsByDate, PaymentsData, PaymentsMetaPagination } from 'api/types'
import { Box, DefaultList, DefaultListItemObj, TextLineWithIconProps } from 'components'
import { VATheme } from 'styles/theme'

import { getTestIDFromTextLines } from './accessibility'
import { formatDateUtc, getFormattedDate } from './formattingUtils'

/**
 * @param paymentList - type PaymentsList, list of payments
 *
 * @returns return the payment list grouped by date
 */
export const groupPaymentsByDate = (paymentsList?: Array<PaymentsData>): PaymentsByDate => {
  const paymentsByDate = groupBy(paymentsList || [], (payment) => {
    return formatDateUtc(payment.attributes.date, 'yyyy-MM-dd')
  })
  return paymentsByDate
}

/**
 * @param paymentsGroupedByDate - type PaymentsByDate, set payments by date
 * @param theme - type VATheme, the theme object to set some properties
 * @param translate - function, the translate function
 * @param onPaymentPress - function, the function that will be triggered on payment press
 * @param isReverseSort - boolean, set if it is a reverse sort
 * @param paymentsPageMetaData - type   paymentsPageMetaData: PaymentsMetaPagination,
, set the pagination info
 *
 * @returns list of payments
 */
export const getGroupedPayments = (
  paymentsGroupedByDate: PaymentsByDate,
  theme: VATheme,
  translations: { t: TFunction },
  onPaymentPress: (payment: PaymentsData) => void,
  isReverseSort: boolean,
  paymentsPageMetaData: PaymentsMetaPagination,
): ReactNode => {
  if (!paymentsGroupedByDate) {
    return <></>
  }

  const sortedDates = keys(paymentsGroupedByDate).sort()
  if (isReverseSort) {
    sortedDates.reverse()
  }

  //track the start index for each grouping to get the current item position for a11yValue
  let groupIdx = 0
  return map(sortedDates, (date) => {
    const listOfPayments = paymentsGroupedByDate[date]
    const listItems = getListItemsForPayments(
      listOfPayments,
      translations,
      onPaymentPress,
      paymentsPageMetaData,
      groupIdx,
    )

    groupIdx = groupIdx + listItems.length
    const displayedDate = getFormattedDate(date, 'MMMM d, yyyy')
    return (
      <Box key={date} mb={theme.dimensions.standardMarginBetween}>
        <DefaultList items={listItems} title={displayedDate} />
      </Box>
    )
  })
}

/**
 * @param listOfPayments - type PaymentsList, set payment by date
 * @param translations - function, the translate function
 * @param onPaymentPress - function, the function that will be triggered on payment press
 * @param paymentsPagination - type   paymentsPagination: PaymentsMetaPagination,
, set the pagination info
 * @param groupIdx - number, id of the payment group
 *
 * @returns Array list of payment items
 */
const getListItemsForPayments = (
  listOfPayments: Array<PaymentsData>,
  translations: { t: TFunction },
  onPaymentPress: (payement: PaymentsData) => void,
  paymentsPagination: PaymentsMetaPagination,
  groupIdx: number,
): Array<DefaultListItemObj> => {
  const listItems: Array<DefaultListItemObj> = []
  const { t } = translations
  const { currentPage, perPage, totalEntries } = paymentsPagination

  forEach(listOfPayments, (payment, index) => {
    const { paymentType, amount } = payment.attributes
    const textLines: Array<TextLineWithIconProps> = []

    textLines.push(
      { text: t('text.raw', { text: paymentType }), variant: 'MobileBodyBold' },
      { text: t('text.raw', { text: amount }), variant: 'MobileBody' },
    )

    const position = (currentPage - 1) * perPage + (groupIdx + index + 1)
    const a11yValue = t('listPosition', { position, total: totalEntries })

    listItems.push({
      textLines,
      a11yValue,
      onPress: () => onPaymentPress(payment),
      a11yHintText: t('payments.viewDetails'),
      testId: getTestIDFromTextLines(textLines),
    })
  })

  return listItems
}

/**
 * @param year - type string, set the year
 *
 * @returns tuple of the first and last day of the year
 */
export const getFirstAndLastDayOfYear = (year?: string): [string | undefined, string | undefined] => {
  let firstDayOfyear: string | undefined
  let lastDayOfyear: string | undefined
  if (year) {
    const startDay = DateTime.fromISO(year)
      .set({ month: 1, day: 1, hour: 0, minute: 0, millisecond: 999 })
      .endOf('day')
      .toISO()
    const endDay = DateTime.fromISO(year)
      .set({ month: 12, day: 31, hour: 23, minute: 59, millisecond: 999 })
      .endOf('day')
      .toISO()
    if (startDay && endDay) {
      firstDayOfyear = startDay
      lastDayOfyear = endDay
    }
  }

  return [firstDayOfyear, lastDayOfyear]
}
