import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextArea, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import { SubmitEvidenceStackParams } from './SubmitEvidenceSubtask'

type SubmitEvidenceProps = StackScreenProps<SubmitEvidenceStackParams, 'SubmitEvidence'>

function SubmitEvidence({ navigation, route }: SubmitEvidenceProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { claimID } = route.params

  useSubtaskProps({
    title: t('claimDetails.submitEvidence'),
    leftButtonText: t('cancel'),
    onLeftButtonPress: () => navigation.goBack(),
  })

  const onFilePress = () => {
    logAnalyticsEvent(Events.vama_evidence_start(claimID, null, 'Submit Evidence', 'file'))
    navigateTo('SelectFile', { claimID })
  }

  const onPhotoPress = () => {
    logAnalyticsEvent(Events.vama_evidence_start(claimID, null, 'Submit Evidence', 'photo'))
    navigateTo('TakePhotos', { claimID })
  }

  return (
    <VAScrollView>
      <Box mb={theme.dimensions.contentMarginBottom} flex={1}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('claimDetails.submitEvidence.whatToKnow.title')}
          </TextView>
          <TextView variant="MobileBody">{t('claimDetails.submitEvidence.whatToKnow.body')}</TextView>
        </TextArea>
      </Box>
      <Box
        mt={theme.dimensions.standardMarginBetween}
        mx={theme.dimensions.gutter}
        mb={theme.dimensions.contentMarginBottom}>
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
    </VAScrollView>
  )
}

export default SubmitEvidence
