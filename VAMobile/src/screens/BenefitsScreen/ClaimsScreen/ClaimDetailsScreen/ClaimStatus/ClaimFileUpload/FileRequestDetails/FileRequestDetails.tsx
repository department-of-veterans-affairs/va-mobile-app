import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { isBefore, parseISO } from 'date-fns'
import { map } from 'underscore'

import {
  AlertWithHaptics,
  Box,
  BoxProps,
  ClickToCallPhoneNumber,
  StructuredContentRenderer,
  TextArea,
  TextView,
  VAScrollView,
} from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { ClaimStatusConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { FileRequestStackParams } from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import { logAnalyticsEvent } from 'utils/analytics'
import { hasUploadedOrReceived } from 'utils/claims'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type FileRequestDetailsProps = StackScreenProps<FileRequestStackParams, 'FileRequestDetails'>

function FileRequestDetails({ navigation, route }: FileRequestDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { claimID, request } = route.params
  const { standardMarginBetween, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const {
    displayName,
    type,
    status,
    description,
    uploadDate,
    documents,
    friendlyName,
    shortDescription,
    longDescription,
    nextSteps,
    canUploadFile,
    uploadsAllowed,
    suspenseDate,
  } = request

  // Use override content fields with graceful fallback
  const title = friendlyName || displayName
  const showUploadButtons = canUploadFile ?? uploadsAllowed ?? true
  // Check if we have enriched content (longDescription indicates override content is present)
  const hasEnrichedContent = !!longDescription?.blocks && longDescription.blocks.length > 0
  // Check if suspense date is in the past
  const isPastDue = suspenseDate ? isBefore(parseISO(suspenseDate), new Date()) : false

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigation.goBack(),
    leftButtonTestID: 'fileRequestDetailsBackID',
  })

  const hasUploaded = hasUploadedOrReceived(request)
  const isClosed = type.startsWith('never_received') || status === ClaimStatusConstants.NO_LONGER_REQUIRED
  const isReviewed = type.startsWith('received_from') && status !== ClaimStatusConstants.SUBMITTED_AWAITING_REVIEW
  const isPending = !isClosed && !isReviewed
  const noneNoted = t('noneNoted')

  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    mt: contentMarginTop,
  }

  const getUploadedFileNames = (): JSX.Element[] | JSX.Element => {
    const uploadedFileNames = map(documents || [], (item, index) => {
      return (
        <TextView paragraphSpacing={true} variant="MobileBody" key={index}>
          {item.filename}
        </TextView>
      )
    })

    return uploadedFileNames.length > 0 ? uploadedFileNames : <TextView variant="MobileBody">{noneNoted}</TextView>
  }

  // apparently we can use date here and not just uploadDate as well
  const getUploadedDate = (): string => {
    return uploadDate ? formatDateMMMMDDYYYY(uploadDate) : noneNoted
  }

  const getUploadedFileType = (): string | undefined => {
    return documents && documents.length > 0 ? documents[0].fileType : noneNoted
  }

  const onFilePress = () => {
    logAnalyticsEvent(Events.vama_evidence_start(claimID, request.trackedItemId || null, request.type, 'file'))
    navigateTo('SelectFile', { claimID, request })
  }

  const onPhotoPress = () => {
    logAnalyticsEvent(Events.vama_evidence_start(claimID, request.trackedItemId || null, request.type, 'photo'))
    navigateTo('TakePhotos', { claimID, request })
  }

  // Determine if action buttons should be shown
  const shouldShowActionButtons = !hasUploaded && showUploadButtons

  return (
    <VAScrollView testID="fileRequestDetailsID">
      <SubtaskTitle title={title || ''} />

      <Box mb={contentMarginBottom} flex={1}>
        {/* Show due date when suspenseDate is present */}
        {suspenseDate && (
          <Box mx={gutter} mb={standardMarginBetween}>
            <TextView variant="MobileBody">
              {t('fileRequestDetails.respondBy', { date: formatDateMMMMDDYYYY(suspenseDate) })}
            </TextView>
          </Box>
        )}

        {/* Show past due warning alert when suspense date has passed */}
        {isPastDue && (
          <Box mx={gutter} mb={standardMarginBetween}>
            <AlertWithHaptics
              variant="warning"
              header={t('fileRequestDetails.pastDue.title')}
              description={t('fileRequestDetails.pastDue.body')}>
              <Box mt={standardMarginBetween}>
                <TextView variant="MobileBody">{t('fileRequestDetails.pastDue.callText')}</TextView>
                <ClickToCallPhoneNumber phone={t('8008271000')} />
              </Box>
            </AlertWithHaptics>
          </Box>
        )}

        {hasUploaded && (
          <Box mb={standardMarginBetween}>
            <TextArea>
              {isClosed ? (
                <TextView variant="MobileBodyBold" accessibilityRole="header" paragraphSpacing={true}>
                  {t('noLongerNeeded')}
                </TextView>
              ) : (
                <>
                  <TextView variant="MobileBodyBold" accessibilityRole="header">
                    {t('fileRequestDetails.submittedTitle')}
                  </TextView>
                  <TextView paragraphSpacing={true} variant="MobileBody">
                    {getUploadedDate()}
                    {isPending && ` (${t('pending')})`}
                  </TextView>
                </>
              )}
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.fileTitle')}
              </TextView>
              {getUploadedFileNames()}
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.typeTitle')}
              </TextView>
              <TextView variant="MobileBody">{getUploadedFileType()}</TextView>
            </TextArea>
          </Box>
        )}

        {/* Enriched content layout */}
        {hasEnrichedContent ? (
          <>
            {/* "What we need from you" section with longDescription */}
            <TextArea>
              <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.whatWeNeed')}
              </TextView>
              <StructuredContentRenderer content={longDescription} testID="longDescriptionContent" />
            </TextArea>

            {/* Render nextSteps as "How to submit this information" */}
            {nextSteps?.blocks && nextSteps.blocks.length > 0 && (
              <Box mt={standardMarginBetween}>
                <TextArea>
                  <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
                    {t('fileRequestDetails.howToSubmit')}
                  </TextView>
                  <StructuredContentRenderer content={nextSteps} testID="nextStepsContent" />
                </TextArea>
              </Box>
            )}
          </>
        ) : (
          /* Fallback: existing layout when enriched content is not present */
          <TextArea>
            <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
              {title}
            </TextView>
            <TextView variant="MobileBody">{shortDescription || description}</TextView>
          </TextArea>
        )}
      </Box>
      {shouldShowActionButtons && (
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
      )}
    </VAScrollView>
  )
}

export default FileRequestDetails
