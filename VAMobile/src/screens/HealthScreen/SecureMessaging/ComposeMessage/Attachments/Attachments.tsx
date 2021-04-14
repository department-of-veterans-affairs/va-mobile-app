import React, { FC, ReactNode, useEffect, useState } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ImagePickerResponse } from 'react-native-image-picker'
import { NAMESPACE } from 'constants/namespaces'
import { onAddFileAttachments } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type AttachmentsProps = StackScreenProps<HealthStackParamList, 'Attachments'>

const Attachments: FC<AttachmentsProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { showActionSheetWithOptions } = useActionSheet()
  const [error, setError] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const callbackOnSuccessfulFileSelection = (_response: ImagePickerResponse | DocumentPickerResponse): void => {}

  const onSelectAFile = (): void => {
    onAddFileAttachments(t, showActionSheetWithOptions, setError, callbackOnSuccessfulFileSelection, 0)
  }

  return (
    <VAScrollView {...testIdProps('Attachments-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!error && <TextView>{error}</TextView>}
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('secureMessaging.attachments.fileAttachment')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.youMayAttach')}
        </TextView>
        <TextView variant="MobileBody">{t('secureMessaging.attachments.acceptedFileTypes')}</TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.sizeRequirements')}
        </TextView>
        <VAButton
          label={t('secureMessaging.attachments.selectAFile')}
          onPress={onSelectAFile}
          buttonType={ButtonTypesConstants.buttonPrimary}
          a11yHint={t('secureMessaging.attachments.selectAFile.a11yHint')}
        />
      </Box>
    </VAScrollView>
  )
}

export default Attachments
