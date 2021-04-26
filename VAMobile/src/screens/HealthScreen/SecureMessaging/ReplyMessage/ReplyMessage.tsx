import React, { FC, ReactNode, useEffect, useState } from 'react'

import {
  BackButton,
  Box,
  ButtonTypesConstants,
  CrisisLineCta,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  TextArea,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
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

  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [messageReply, setMessageReply] = useState('')
  const [attachmentsList] = useState<Array<ImagePickerResponse | DocumentPickerResponse>>([])

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

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        removeOnPress: () => {}, // TODO: hook up to Remove Attachments page
        largeButtonProps:
          attachmentsList.length < theme.dimensions.maxNumMessageAttachments
            ? {
                label: t('secureMessaging.formMessage.addFiles'),
                a11yHint: t('secureMessaging.formMessage.addFiles.a11yHint'),
                onPress: () => {}, // TODO: hook up to Attachments page
              }
            : undefined,
        attachmentsList,
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        value: messageReply,
        onChange: setMessageReply,
        labelKey: 'health:secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]
  const renderForm = (): ReactNode => {
    return (
      <TextArea>
        <TextView>{t('secureMessaging.formMessage.to')}</TextView>
        <TextView>{t('secureMessaging.formMessage.subject')}</TextView>
        <FormWrapper fieldsList={formFieldsList} onSave={(): void => {}} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton
            label={t('secureMessaging.formMessage.send')}
            onPress={() => setOnSaveClicked(true)}
            a11yHint={t('secureMessaging.formMessage.send.a11yHint')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton
            label={t('common:cancel')}
            onPress={() => navigation.goBack()}
            a11yHint={t('secureMessaging.formMessage.cancel.a11yHint')}
            buttonType={ButtonTypesConstants.buttonSecondary}
          />
        </Box>
      </TextArea>
    )
  }

  return (
    <VAScrollView {...testIdProps('Reply-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box>{renderForm()}</Box>

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
