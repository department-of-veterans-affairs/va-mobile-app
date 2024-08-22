import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertWithHaptics, Box, LinkWithAnalytics, TextArea, TextView } from 'components'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import { Events } from 'constants/analytics'
import { MAX_NUM_PHOTOS } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import { onAddPhotos } from 'utils/claims'
import getEnv from 'utils/env'
import { useBeforeNavBackListener, useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'

const { LINK_URL_GO_TO_VA_GOV } = getEnv()

type TakePhotosProps = StackScreenProps<BenefitsStackParamList, 'TakePhotos'>

function TakePhotos({ navigation, route }: TakePhotosProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const showActionSheetWithOptions = useShowActionSheet()
  const { claimID, request } = route.params
  const { displayName } = request
  const [error, setError] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false)

  useBeforeNavBackListener(navigation, (e) => {
    if (isActionSheetVisible) {
      e.preventDefault()
    }
  })

  const callbackIfUri = (response: ImagePickerResponse): void => {
    if (response.assets && response.assets.length > MAX_NUM_PHOTOS) {
      setError(t('fileUpload.tooManyPhotosError'))
    } else {
      navigateTo('UploadOrAddPhotos', { claimID, request, firstImageResponse: response })
    }
  }

  const onCancel = () => {
    logAnalyticsEvent(Events.vama_evidence_cancel_1(claimID, request.trackedItemId || null, request.type, 'photo'))
    navigation.goBack()
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      leftButtonText={t('cancel')}
      onLeftButtonPress={onCancel}
      title={t('fileUpload.selectPhotos')}
      testID="takePhotosTestID">
      {!!error && (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <AlertWithHaptics variant="error" description={error} scrollViewRef={scrollViewRef} />
        </Box>
      )}
      <Box mb={theme.dimensions.standardMarginBetween}>
        <AlertWithHaptics
          variant="info"
          expandable={true}
          header={t('fileUpload.accessibilityAlert.title')}
          description={t('fileUpload.accessibilityAlert.body')}
          descriptionA11yLabel={a11yLabelVA(t('fileUpload.accessibilityAlert.body'))}>
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_GO_TO_VA_GOV}
            text={t('goToVAGov')}
            a11yLabel={a11yLabelVA(t('goToVAGov'))}
          />
        </AlertWithHaptics>
      </Box>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('fileUpload.uploadFileUsingCamera', { displayName })}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.takePhotoEachPage')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} {...testIdProps(t('fileUpload.ifMoreThan10.a11y'))}>
          {t('fileUpload.ifMoreThan10.1')}
          <TextView variant="MobileBodyBold">
            {t('fileUpload.ifMoreThan10.2')}
            <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('fileUpload.ifMoreThan10.3'))}>
              {t('fileUpload.ifMoreThan10.3')}
            </TextView>
          </TextView>
        </TextView>
        <TextView variant="MobileBodyBold">{t('fileUpload.maxFileSize')}</TextView>
        <TextView variant="MobileBody" accessibilityLabel={t('fileUpload.50MB.a11y')} paragraphSpacing={true}>
          {t('fileUpload.50MB')}
        </TextView>
        <TextView variant="MobileBodyBold">{t('fileUpload.acceptedFileTypes')}</TextView>
        <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
      </TextArea>
      <Box
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Button
          onPress={(): void =>
            onAddPhotos(
              t,
              showActionSheetWithOptions,
              setError,
              callbackIfUri,
              0,
              claimID,
              request,
              setIsActionSheetVisible,
            )
          }
          label={t('fileUpload.takeOrSelectPhotos')}
          testID={t('fileUpload.takePhotos')}
        />
      </Box>
    </FullScreenSubtask>
  )
}

export default TakePhotos
