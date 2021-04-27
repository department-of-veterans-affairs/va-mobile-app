import React, { FC, ReactNode, useEffect } from 'react'

import { AlertBox, BackButton, Box, CrisisLineCta, LoadingComponent, TextView, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState } from 'store'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { formatSubject } from 'utils/secureMessaging'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import { useSelector } from 'react-redux'

type ReplyMessageProps = StackScreenProps<HealthStackParamList, 'ReplyMessage'>

const ReplyMessage: FC<ReplyMessageProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const messageID = Number(route.params.messageID)
  const { messagesById, threads, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))
  const subject = message ? message.subject : ''
  const category = message ? message.category : 'OTHER'

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  if (loading) {
    return <LoadingComponent text={t('secureMessaging.viewMessage.loading')} />
  }

  return (
    <VAScrollView {...testIdProps('Reply-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom}>
        <AlertBox title="Placeholder for Reply Form" border={'informational'} background={'noCardBackground'} />
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView ml={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} variant={'MobileBodyBold'}>
            {t('secureMessaging.reply.messageThread')}
          </TextView>
        </Box>
        {message && messagesById && thread && (
          <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
            <Box accessibilityRole={'header'} accessible={true} borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
              <TextView variant="BitterBoldHeading">{formatSubject(category, subject, t)}</TextView>
            </Box>
            {renderMessages(message, messagesById, thread)}
          </Box>
        )}
      </Box>
    </VAScrollView>
  )
}

export default ReplyMessage
