import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollView } from 'react-native'

import { useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useFolderMessages } from 'api/secureMessaging'
import { useAllMessageRecipients } from 'api/secureMessaging/getAllMessageRecipients'
import { SecureMessagingMessageData, SecureMessagingMessageList } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  ChildTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  MessageList,
  Pagination,
  PaginationProps,
} from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { Events } from 'constants/analytics'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import NoFolderMessages from 'screens/HealthScreen/SecureMessaging/NoFolderMessages/NoFolderMessages'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { getMessagesListItems } from 'utils/secureMessaging'
import { screenContentAllowed } from 'utils/waygateConfig'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type FolderMessagesProps = StackScreenProps<HealthStackParamList, 'FolderMessages'>

function FolderMessages({ route }: FolderMessagesProps) {
  const { folderID, folderName } = route.params

  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const [page, setPage] = useState(1)
  const isFocused = useIsFocused()
  const {
    data: folderMessagesData,
    isFetching: loadingFolderMessages,
    error: folderMessagesError,
    refetch: refetchFolderMessages,
  } = useFolderMessages(folderID, {
    enabled: isFocused && screenContentAllowed('WG_FolderMessages'),
  })
  const [messagesToShow, setMessagesToShow] = useState<Array<SecureMessagingMessageData>>([])
  const [noRecipientsError, setNoRecipientsError] = useState(false)
  const {
    data: recipientsResponse,
    isFetched: hasLoadedRecipients,
    isFetching: loadingRecipients,
    error: recipientsError,
  } = useAllMessageRecipients({ enabled: isFocused && screenContentAllowed('WG_FolderMessages') })
  const recipients = recipientsResponse?.data

  useEffect(() => {
    if (hasLoadedRecipients && !loadingRecipients) {
      setNoRecipientsError((!recipients || recipients.length === 0) && !recipientsError)
    }
  }, [recipients, hasLoadedRecipients, loadingRecipients, recipientsError])

  useEffect(() => {
    const messagesList = folderMessagesData?.data.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
    if (page > 1 && !loadingFolderMessages && !folderMessagesError && messagesList?.length === 0) {
      setPage(page - 1) // avoid empty page if last message on page was moved
    }
    setMessagesToShow(messagesList || [])
  }, [folderMessagesData?.data, folderMessagesError, loadingFolderMessages, page])

  const messages = folderMessagesData?.data || ([] as SecureMessagingMessageList)
  const paginationMetaData = folderMessagesData?.meta.pagination
  const title = t('text.raw', { text: folderName })

  const onMessagePress = (messageID: number, isDraft?: boolean): void => {
    const screen = isDraft ? 'EditDraft' : 'ViewMessage'
    const args = isDraft
      ? { messageID, attachmentFileToAdd: {}, attachmentFileToRemove: {} }
      : { messageID, folderID, currentPage: page }

    navigateTo(screen, args)
  }

  // Resets scroll position to top whenever current page appointment list changes:
  // Previously IOS left position at the bottom, which is where the user last tapped to navigate to next/prev page.
  // Position reset is necessary to make the pagination component padding look consistent between pages,
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
  }, [page])

  function renderPagination() {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
      },
      onPrev: () => {
        setPage(page - 1)
      },
      totalEntries: paginationMetaData?.totalEntries || 0,
      pageSize: DEFAULT_PAGE_SIZE,
      page,
      tab: 'folder messages',
    }

    return (
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  const onPress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
  }

  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  return (
    <ChildTemplate
      backLabelOnPress={() => {
        navigateTo('SecureMessaging', { activeTab: 1 })
      }}
      title={title}
      scrollViewProps={scrollViewProps}
      backLabelTestID="foldersBackToMessagesID">
      {loadingFolderMessages ? (
        <LoadingComponent text={t('secureMessaging.messages.loading')} />
      ) : folderMessagesError ? (
        <Box mt={20} mb={theme.dimensions.buttonPadding}>
          <AlertWithHaptics
            variant="error"
            header={t('secureMessaging.folders.messageDownError.title')}
            description={t('secureMessaging.inbox.messageDownError.body')}
            primaryButton={{ label: t('refresh'), onPress: refetchFolderMessages }}
          />
        </Box>
      ) : messages.length === 0 ? (
        <NoFolderMessages noRecipientsError={noRecipientsError} />
      ) : (
        <>
          {noRecipientsError ? (
            <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
              <AlertWithHaptics
                variant="info"
                expandable={true}
                header={t('secureMessaging.noCareTeams.header')}
                description={t('secureMessaging.noCareTeams.body')}
                descriptionA11yLabel={a11yLabelVA(t('secureMessaging.noCareTeams.body'))}
                testID="noCareTeamsAlertTestID">
                <LinkWithAnalytics
                  type="custom"
                  text={t('upcomingAppointmentDetails.findYourVAFacility')}
                  a11yLabel={a11yLabelVA(t('upcomingAppointmentDetails.findYourVAFacility'))}
                  a11yHint={t('upcomingAppointmentDetails.findYourVAFacility.a11yHint')}
                  onPress={() => Linking.openURL(WEBVIEW_URL_FACILITY_LOCATOR)}
                />
              </AlertWithHaptics>
            </Box>
          ) : (
            <Box mx={theme.dimensions.buttonPadding}>
              <Button
                label={t('secureMessaging.startNewMessage')}
                onPress={onPress}
                testID={'startNewMessageButtonTestID'}
              />
            </Box>
          )}
          <Box mt={theme.dimensions.standardMarginBetween}>
            <MessageList items={getMessagesListItems(messagesToShow, t, onMessagePress, folderName)} />
          </Box>
          {renderPagination()}
        </>
      )}
    </ChildTemplate>
  )
}

export default FolderMessages
