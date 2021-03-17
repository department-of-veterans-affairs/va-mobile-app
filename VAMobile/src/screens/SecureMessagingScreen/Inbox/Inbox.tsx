import { TFunction } from 'i18next'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import _ from 'underscore'
import moment from 'moment'

import { Box, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagesList } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
//import NoMessages from '../NoMessages/NoMessages'

// const getListItemsForAppointments = (listOfAppointments: AppointmentsList, t: TFunction, onAppointmentPress: (appointmentID: string) => void): Array<ListItemObj> => {
//   const listItems: Array<ListItemObj> = []

//   _.forEach(listOfAppointments, (appointment) => {
//     const { attributes } = appointment
//     const { startDateUtc, timeZone, appointmentType, location } = attributes

//     const textLines: Array<TextLine> = [
//       { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
//       { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
//       { text: t('common:text.raw', { text: getAppointmentLocation(appointmentType, location.name, t) }) },
//     ]

//     if (attributes.status === AppointmentStatusConstants.CANCELLED) {
//       textLines.push({ text: t('appointments.canceled'), variant: 'MobileBodyBold', color: 'error' })
//     }

//     listItems.push({ textLines, onPress: () => onAppointmentPress(appointment.id), a11yHintText: t('appointments.viewDetails') })
//   })

//   return listItems
// }

const getListItemsForMessages = (listOfMessages: SecureMessagesList, t: TFunction, onMessagePress: (messageID: string) => void): Array<ListItemObj> => {
  const listItems: Array<ListItemObj> = []

  _.forEach(listOfMessages, (message) => {
    const { attributes } = message
    const { senderName, subject, sentDate } = attributes
    const formattedDate = moment(sentDate)

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: subject }) },
      { text: t('common:text.raw', { text: `${formattedDate.format('DD MMM @ HHmm zz')}` }) },
    ]

    listItems.push({ textLines, onPress: () => onMessagePress(message.id), a11yHintText: t('secure_messaging.viewDetails') })
  })

  return listItems
}

export const getMessages = (messages: SecureMessagesList, theme: VATheme, t: TFunction, onMessagePress: (messageID: string) => void, isReverseSort: boolean): ReactNode => {
  if (!messages) {
    return <></>
  }

  const listOfMessages = messages
  const listItems = getListItemsForMessages(listOfMessages, t, onMessagePress)

  return <List items={listItems} />
}

type InboxProps = Record<string, unknown>

const Inbox: FC<InboxProps> = () => {
  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { inboxMessages, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const onInboxMessagePress = (messageID: string): void => {
    navigateTo('InboxMessage', { messageID })()
  }

  if (loading) {
    return <LoadingComponent />
  }

  if (_.isEmpty(inboxMessages)) {
    // TODO What is empty inbox view?
    //return <NoMessages />
  }

  return (
    <Box {...testIdProps('Inbox-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.inbox'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.inbox')}</TextView>
      </Box>
      {getMessages(inboxMessages || [], theme, t, onInboxMessagePress, false)}
    </Box>
  )
}

export default Inbox
