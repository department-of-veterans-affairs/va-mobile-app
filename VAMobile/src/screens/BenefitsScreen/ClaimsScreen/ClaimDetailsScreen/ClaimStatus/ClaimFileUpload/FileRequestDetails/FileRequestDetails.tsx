import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, BoxProps, ButtonTypesConstants, ChildTemplate, TextArea, TextView, VAButton } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { hasUploadedOrReceived } from 'utils/claims'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { waygateNativeAlert } from 'utils/waygateConfig'

type FileRequestDetailsProps = StackScreenProps<BenefitsStackParamList, 'FileRequestDetails'>

const FileRequestDetails: FC<FileRequestDetailsProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { claimID, request } = route.params
  const { standardMarginBetween, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const { displayName, type, status, description, uploadDate, documents } = request

  const hasUploaded = hasUploadedOrReceived(request)
  const isClosed = type.startsWith('never_received') || status === 'NO_LONGER_REQUIRED'
  const isReviewed = type.startsWith('received_from') && status !== 'SUBMITTED_AWAITING_REVIEW'
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
    if (waygateNativeAlert('WG_SelectFile')) {
      navigateTo('SelectFile', { claimID, request })()
    }
  }

  const onPhotoPress = () => {
    logAnalyticsEvent(Events.vama_evidence_start(claimID, request.trackedItemId || null, request.type, 'photo'))
    if (waygateNativeAlert('WG_TakePhotos')) {
      navigateTo('TakePhotos', { claimID, request })()
    }
  }

  return (
    <ChildTemplate backLabel={t('request.backLabel')} backLabelOnPress={navigation.goBack} title={displayName || ''} testID="fileRequestDetailsID">
      <Box mb={contentMarginBottom} flex={1}>
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
        <TextArea>
          <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {displayName}
          </TextView>
          <TextView variant="MobileBody">{description}</TextView>
        </TextArea>
      </Box>
      {!hasUploaded && (
        <Box {...boxProps}>
          <Box mt={standardMarginBetween} mx={gutter} mb={contentMarginBottom}>
            <VAButton onPress={onFilePress} label={t('fileUpload.selectAFile')} testID={t('fileUpload.selectAFile')} buttonType={ButtonTypesConstants.buttonSecondary} />
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <VAButton onPress={onPhotoPress} label={t('fileUpload.takePhotos')} testID={t('fileUpload.takePhotos')} buttonType={ButtonTypesConstants.buttonSecondary} />
            </Box>
          </Box>
        </Box>
      )}
    </ChildTemplate>
  )
}

export default FileRequestDetails
