import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { map } from 'underscore'

import { Box, BoxProps, FullScreenSubtask, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { hasUploadedOrReceived } from 'utils/claims'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type SubmitEvidenceProps = StackScreenProps<BenefitsStackParamList, 'SubmitEvidence'>

function SubmitEvidence({ navigation, route }: SubmitEvidenceProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { claimID } = route.params
  const { standardMarginBetween, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions

  //   const hasUploaded = hasUploadedOrReceived(request)
  //   const isClosed = type.startsWith('never_received') || status === 'NO_LONGER_REQUIRED'
  //   const isReviewed = type.startsWith('received_from') && status !== 'SUBMITTED_AWAITING_REVIEW'
  //   const isPending = !isClosed && !isReviewed

  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    mt: contentMarginTop,
  }

  const onFilePress = () => {
    //logAnalyticsEvent(Events.vama_evidence_start(claimID, request.trackedItemId || null, request.type, 'file'))
    navigateTo('SelectFile', { claimID })
  }

  const onPhotoPress = () => {
    //logAnalyticsEvent(Events.vama_evidence_start(claimID, request.trackedItemId || null, request.type, 'photo'))
    //navigateTo('TakePhotos', { claimID, request })
  }

  return (
    <FullScreenSubtask
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      title={t('submitEvidence')}
      testID="fileRequestDetailsID">
      <Box mb={contentMarginBottom} flex={1}>
        <TextArea>
          <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('submitEvidence.whatToKnow')}
          </TextView>
          <TextView variant="MobileBody">{t('submitEvidence.whatToKnow.body')}</TextView>
        </TextArea>
      </Box>
      <Box {...boxProps}>
        <Box mt={standardMarginBetween} mx={gutter} mb={contentMarginBottom}>
          <Button
            onPress={onFilePress}
            label={t('fileUpload.selectAFile')}
            testID={t('fileUpload.selectAFile')}
            buttonType={ButtonVariants.Secondary}
          />
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <Button
              onPress={onPhotoPress}
              label={t('fileUpload.takePhotos')}
              testID={t('fileUpload.takePhotos')}
              buttonType={ButtonVariants.Secondary}
            />
          </Box>
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default SubmitEvidence
