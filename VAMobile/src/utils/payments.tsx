import { TFunction } from 'i18next'
import { each, forEach, groupBy, keys, map } from 'underscore'
import React, { ReactNode } from 'react'

import { Box, DefaultList, DefaultListItemObj, TextLineWithIconProps } from 'components'
import { LoadedPayments, PaymentsByDate, PaymentsGetData, PaymentsList, PaymentsMap, PaymentsMetaPagination, PaymentsPaginationByYearAndPage } from 'store/api'
import { VATheme } from 'styles/theme'
import { getFormattedDate } from './formattingUtils'
import { getTestIDFromTextLines } from './accessibility'

/**
 * @param paymentList - type PaymentsList, list of payments
 *
 * @returns return the payment list grouped by date
 */
export const groupPaymentsByDate = (paymentsList?: PaymentsList): PaymentsByDate => {
  const paymentsByDate = groupBy(paymentsList || [], (payment) => {
    return getFormattedDate(payment.attributes.date, 'yyyy-MM-dd')
  })

  return paymentsByDate
}

/**
 * @param paymentList - type PaymentsList, list of payments
 *
 * @returns map of the payments id
 */
export const mapPaymentsById = (paymentList?: PaymentsList): PaymentsMap => {
  const paymentsMap = {} as PaymentsMap

  // map Payments by id
  each(paymentList || [], (payment) => {
    paymentsMap[payment.id] = payment
  })

  return paymentsMap
}

/**
 * @param payments - type LoadedPayments, list of cache payments
 * @param paginationData - type PaymentsPaginationByYearAndPage, list of cache pagination
 * @param pageAndYear - year and page key tp retrieve cached pagination and payments
 *
 * @returns returns the cached data for the year and page
 */
export const getLoadedPayments = (payments: LoadedPayments, paginationData: PaymentsPaginationByYearAndPage, pageAndYear: string): PaymentsGetData | null => {
  const loadedPayments = payments[pageAndYear]
  const loadedPagination = paginationData[pageAndYear]
  // do we have the Payments?
  if (loadedPayments) {
    return {
      data: loadedPayments,
      meta: {
        pagination: {
          currentPage: loadedPagination.currentPage,
          perPage: loadedPagination.perPage,
          totalEntries: loadedPagination.totalEntries,
        },
        dataFromStore: true, // informs reducer not to save these payments to the store
      },
    } as PaymentsGetData
  }
  return null
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
  translations: { t: TFunction; tc: TFunction },
  onPaymentPress: (paymentsId: string) => void,
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
    const listItems = getListItemsForPayments(listOfPayments, translations, onPaymentPress, paymentsPageMetaData, groupIdx)

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
  listOfPayments: PaymentsList,
  translations: { t: TFunction; tc: TFunction },
  onPaymentPress: (payementId: string) => void,
  paymentsPagination: PaymentsMetaPagination,
  groupIdx: number,
): Array<DefaultListItemObj> => {
  const listItems: Array<DefaultListItemObj> = []
  const { t, tc } = translations
  const { currentPage, perPage, totalEntries } = paymentsPagination

  forEach(listOfPayments, (payment, index) => {
    const { payementType, amount } = payment.attributes
    const textLines: Array<TextLineWithIconProps> = []

    textLines.push(
      { text: tc('text.raw', { text: payementType }), variant: 'MobileBodyBold', color: 'primaryTitle' },
      { text: tc('text.raw', { text: amount }), variant: 'MobileBody', color: 'primaryTitle' },
    )

    const position = (currentPage - 1) * perPage + (groupIdx + index + 1)
    const a11yValue = tc('listPosition', { position, total: totalEntries })

    listItems.push({
      textLines,
      a11yValue,
      onPress: () => onPaymentPress(payment.id),
      a11yHintText: t('payments.viewDetails'),
      testId: getTestIDFromTextLines(textLines),
    })
  })

  return listItems
}
