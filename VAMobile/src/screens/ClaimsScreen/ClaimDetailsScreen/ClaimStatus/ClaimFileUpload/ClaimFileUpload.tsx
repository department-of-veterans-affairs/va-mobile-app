import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, ReactNode, useEffect } from 'react'

import _ from 'underscore'

import {
  AccordionCollapsible,
  AccordionCollapsibleProps,
  AlertBox,
  Box,
  ButtonTypesConstants,
  ErrorComponent,
  TextArea,
  TextView,
  VAButton,
  VAIcon,
  VAScrollView,
} from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { currentRequestsForVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { getClaim } from 'store/actions'
import { getFormattedDate } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ClaimFileUploadProps = StackScreenProps<ClaimsStackParamList, 'ClaimFileUpload'>

const ClaimFileUpload: FC<ClaimFileUploadProps> = ({ route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()
  const { claimID } = route.params
  const { claim } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const requests = currentRequestsForVet(claim?.attributes.eventsTimeline || [])

  // need to get the claim to keep track of if/when files were uploaded for a request
  useEffect(() => {
    dispatch(getClaim(claimID, ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID))
  }, [dispatch, claimID])

  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(claim?.attributes.eventsTimeline || [])

  const getUploadRequestContent = (isExpanded: boolean, description?: string): ReactNode => {
    return (
      <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween} numberOfLines={isExpanded ? undefined : 1}>
        {description}
      </TextView>
    )
  }

  const uploadedDateDisplayed = (dateDisplayed: string): ReactNode => {
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <VAIcon name="CircleCheckMark" fill="dark" width={18} height={18} />
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" ml={theme.dimensions.textIconMargin}>
          {dateDisplayed}
        </TextView>
      </Box>
    )
  }

  const getUploadRequestHeader = (displayName?: string, dateDisplayed?: string): ReactNode => {
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
          {displayName}
        </TextView>
        {!!dateDisplayed && uploadedDateDisplayed(dateDisplayed)}
      </Box>
    )
  }

  const getUploadRequests = (): ReactElement[] => {
    return _.map(requests, (request, index) => {
      const { displayName, uploaded, uploadDate, description } = request

      const dateDisplayed = uploaded && uploadDate ? t('fileUpload.uploadedDate', { date: getFormattedDate(uploadDate, 'MM/dd/yy') }) : ''

      const accordionProps: AccordionCollapsibleProps = {
        header: getUploadRequestHeader(displayName, dateDisplayed),
        expandedContent: getUploadRequestContent(true, description),
        collapsedContent: getUploadRequestContent(false, description),
        testID: `${displayName} ${dateDisplayed}`,
      }

      return (
        <Box mt={theme.dimensions.condensedMarginBetween} key={index}>
          <AccordionCollapsible {...accordionProps}>
            {!uploaded && (
              <Box>
                <VAButton
                  onPress={navigateTo('SelectFile', { request })}
                  label={t('fileUpload.selectAFile')}
                  testID={t('fileUpload.selectAFile')}
                  buttonType={ButtonTypesConstants.buttonPrimary}
                  a11yHint={t('fileUpload.selectAFileA11yHint')}
                />
                <Box mt={theme.dimensions.condensedMarginBetween}>
                  <VAButton
                    onPress={navigateTo('TakePhotos', { request })}
                    label={t('fileUpload.takePhotos')}
                    testID={t('fileUpload.takePhotos')}
                    buttonType={ButtonTypesConstants.buttonSecondary}
                    a11yHint={t('fileUpload.takePhotosA11yHint')}
                  />
                </Box>
              </Box>
            )}
          </AccordionCollapsible>
        </Box>
      )
    })
  }

  if (useError(ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID} />
  }

  return (
    <VAScrollView {...testIdProps('File-upload-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('fileUpload.uploadFileToClaim')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.toHelpUs')}</TextView>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
            {t('fileUpload.maxFileSize')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.50MB')}</TextView>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
            {t('fileUpload.acceptedFileTypes')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
        </TextArea>
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          mt={theme.dimensions.standardMarginBetween}
          mx={theme.dimensions.gutter}
          accessibilityLabel={t(`claimPhase.youHaveFileRequestA11yHints${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })}>
          {t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })}
        </TextView>
        {getUploadRequests()}
        <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <AlertBox title={t('fileUpload.askForYourClaimDecision')} text={t('fileUpload.youCanAskUs')} border="informational" background="noCardBackground">
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VAButton
                onPress={navigateTo('AskForClaimDecision', { claimID })}
                label={t('fileUpload.viewDetails')}
                testID={t('fileUpload.viewDetails')}
                buttonType={ButtonTypesConstants.buttonPrimary}
                a11yHint={t('fileUpload.viewDetailsA11yHint')}
              />
            </Box>
          </AlertBox>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default ClaimFileUpload
