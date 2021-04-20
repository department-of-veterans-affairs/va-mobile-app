import React, { FC, ReactNode, useEffect } from 'react'

import { AlertBox, BackButton, Box, CrisisLineCta, LoadingComponent, TextView, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState } from 'store'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
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

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    return <></>
  }

  return (
    <VAScrollView {...testIdProps('Reply-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <AlertBox title="Placeholder for Reply Form" border={'informational'} background={'noCardBackground'} />
      <TextView accessible={true} accessibilityRole={'header'} ml={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} variant={'MobileBodyBold'}>
        {t('secureMessaging.reply.messageThread')}
      </TextView>
      <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
        <Box borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
          <TextView variant="BitterBoldHeading" accessibilityRole={'header'}>
            {/* Replace with formatSubjectLine function*/}
            {t('secureMessaging.viewMessage.subject', { subject: message.subject })}
          </TextView>
        </Box>
        {renderMessages(message, messagesById, thread)}
      </Box>
    </VAScrollView>
  )
}

export default ReplyMessage
