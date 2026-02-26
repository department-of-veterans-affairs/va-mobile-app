import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { map } from 'underscore'

import {
  AccordionCollapsible,
  Box,
  ClickToCallPhoneNumber,
  LinkWithAnalytics,
  TextArea,
  TextView,
  VABulletList,
  VABulletListText,
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
import getEnv from 'utils/env'
import { displayedTextPhoneNumber, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { vaGovWebviewTitle } from 'utils/webview'

type FileRequestDetailsProps = StackScreenProps<FileRequestStackParams, 'FileRequestDetails'>

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

function FileRequestDetails({ navigation, route }: FileRequestDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { claimID, request } = route.params
  const {
    standardMarginBetween,
    contentMarginBottom,
    gutter,
    lineItemSpacing,
    attachmentIconTopMargin,
    condensedMarginBetween,
  } = theme.dimensions
  const {
    displayName,
    type,
    status,
    description,
    uploadDate,
    documents,
    requestedDate,
    suspenseDate,
    uploadsAllowed,
    friendlyName,
  } = request

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
  const evidenceRequestsUpdatedUIEnabled = featureEnabled('evidenceRequestsUpdatedUI')
  // Show updated UI only when feature flag is on AND friendlyName is missing
  const showUpdatedUI = evidenceRequestsUpdatedUIEnabled && !friendlyName

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

  const onClaimLettersPress = () => {
    navigateTo('ClaimLettersScreen')
  }

  const formattedRequestedDate = requestedDate ? formatDateMMMMDDYYYY(requestedDate) : null
  const formattedSuspenseDate = suspenseDate ? formatDateMMMMDDYYYY(suspenseDate) : null

  const nextStepsBullets: VABulletListText[] = [
    {
      text: t('fileRequestDetails.nextSteps.bullet1'),
      boldedText: t('fileRequestDetails.nextSteps.bullet1.bold'),
    },
    {
      text: t('fileRequestDetails.nextSteps.bullet2'),
    },
  ]

  const renderRequestDateBlurb = () => {
    if (!formattedRequestedDate) {
      return null
    }

    return (
      // eslint-disable-next-line react-native-a11y/has-accessibility-hint
      <TextView
        variant="MobileBody"
        accessibilityLabel={t('fileRequestDetails.requestDateBlurb.a11yLabel', {
          requestedDate: formattedRequestedDate,
        })}>
        {t('fileRequestDetails.requestDateBlurb', { requestedDate: formattedRequestedDate })}
      </TextView>
    )
  }

  const renderWhatWeNeedFromYouSection = () => {
    return (
      <Box mt={formattedRequestedDate ? 14 : 0}>
        <TextView mb={18} variant="MobileBodyBold" accessibilityRole="header">
          {t('fileRequestDetails.whatWeNeedFromYou')}
        </TextView>
        <TextView variant="MobileBody">{description}</TextView>
      </Box>
    )
  }

  const renderNextStepsSection = () => {
    return (
      <Box mt={condensedMarginBetween}>
        <TextView mb={18} variant="MobileBodyBold" accessibilityRole="header">
          {t('fileRequestDetails.nextSteps')}
        </TextView>
        <TextView variant="MobileBody" mb={standardMarginBetween}>
          {t('fileRequestDetails.nextSteps.toRespond')}
        </TextView>
        <VABulletList listOfText={nextStepsBullets} />
        <TextView variant="MobileBody" mt={standardMarginBetween}>
          {t('fileRequestDetails.nextSteps.needHelpUnderstanding')}
        </TextView>
        <LinkWithAnalytics
          type="custom"
          text={t('fileRequestDetails.accessYourClaimLetters')}
          onPress={onClaimLettersPress}
          testID="accessYourClaimLettersID"
        />
        <TextView variant="MobileBody">{t('fileRequestDetails.nextSteps.findBlankCopies')}</TextView>
        <LinkWithAnalytics
          type="url"
          text={t('fileRequestDetails.findVAForm')}
          url="https://www.va.gov/find-forms/"
          testID="findVAFormID"
        />
      </Box>
    )
  }

  const renderMoreOnSubmittingFilesSection = () => {
    return (
      <Box>
        <AccordionCollapsible
          testID="moreOnSubmittingFilesAccordionID"
          header={<TextView variant="MobileBodyBold">{t('fileRequestDetails.moreOnSubmitting')}</TextView>}
          expandedContent={
            <Box mt={lineItemSpacing}>
              <TextView variant="MobileBody" mb={condensedMarginBetween}>
                <TextView variant="MobileBodyBold">{t('fileRequestDetails.moreOnSubmitting.submitInApp')}</TextView>{' '}
                {t('fileRequestDetails.moreOnSubmitting.submitInApp.description')}
              </TextView>
              <TextView variant="MobileBody" mt={condensedMarginBetween} mb={condensedMarginBetween}>
                <TextView variant="MobileBodyBold">{t('fileRequestDetails.moreOnSubmitting.deliverByMail')}</TextView>{' '}
                {t('fileRequestDetails.moreOnSubmitting.deliverByMail.description')}
              </TextView>
              <TextView variant="MobileBody" mt={condensedMarginBetween} mb={standardMarginBetween}>
                {t('fileRequestDetails.moreOnSubmitting.toMailFiles')}
              </TextView>
              <TextView variant="MobileBody">{t('fileRequestDetails.moreOnSubmitting.address.line1')}</TextView>
              <TextView variant="MobileBody">{t('fileRequestDetails.moreOnSubmitting.address.line2')}</TextView>
              <TextView variant="MobileBody">{t('fileRequestDetails.moreOnSubmitting.address.line3')}</TextView>
              <TextView variant="MobileBody" mb={condensedMarginBetween}>
                {t('fileRequestDetails.moreOnSubmitting.address.line4')}
              </TextView>
              <TextView variant="MobileBody" mt={condensedMarginBetween} mb={condensedMarginBetween}>
                {t('fileRequestDetails.moreOnSubmitting.bringInPerson')}
              </TextView>
              <LinkWithAnalytics
                type="custom"
                text={t('fileRequestDetails.moreOnSubmitting.findVALocation')}
                onPress={() => {
                  navigateTo('Webview', {
                    url: WEBVIEW_URL_FACILITY_LOCATOR,
                    displayTitle: vaGovWebviewTitle(t),
                    loadingMessage: t('webview.valocation.loading'),
                  })
                }}
                testID="findVALocationID"
              />
            </Box>
          }
        />
      </Box>
    )
  }

  const renderNeedHelpSection = () => {
    return (
      <Box>
        <AccordionCollapsible
          testID="needHelpAccordionID"
          header={<TextView variant="MobileBodyBold">{t('fileRequestDetails.needHelp')}</TextView>}
          expandedContent={
            <Box mt={lineItemSpacing}>
              {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
              <TextView
                variant="MobileBody"
                mb={condensedMarginBetween}
                accessibilityLabel={t('fileRequestDetails.needHelp.callVA.a11yLabel')}>
                {t('fileRequestDetails.needHelp.callVA')}
              </TextView>
              <ClickToCallPhoneNumber phone={displayedTextPhoneNumber(t('8008271000'))} />
            </Box>
          }
        />
      </Box>
    )
  }

  return (
    <VAScrollView testID="fileRequestDetailsID">
      <SubtaskTitle title={showUpdatedUI ? t('fileRequestDetails.title') : displayName || ''} />
      {showUpdatedUI && formattedSuspenseDate && (
        <Box mx={gutter} mt={attachmentIconTopMargin} mb={lineItemSpacing}>
          <TextView variant="MobileBody">
            {t('fileRequestDetails.respondByFor', { date: formattedSuspenseDate, displayName })}
          </TextView>
        </Box>
      )}

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
          {showUpdatedUI ? (
            <>
              {renderRequestDateBlurb()}
              {renderWhatWeNeedFromYouSection()}
              {renderNextStepsSection()}
              {uploadsAllowed && renderMoreOnSubmittingFilesSection()}
              {renderNeedHelpSection()}
            </>
          ) : (
            <>
              <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
                {displayName}
              </TextView>
              <TextView variant="MobileBody">{description}</TextView>
            </>
          )}
        </TextArea>
      </Box>
      {!hasUploaded && (
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
      )}
    </VAScrollView>
  )
}

export default FileRequestDetails
