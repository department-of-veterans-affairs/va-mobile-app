import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect } from 'react'

import _ from 'underscore'

import { AlertBox, Box, TextArea, TextView, VAButton, VAIcon } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { currentRequestsForVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { getClaim } from 'store/actions'
import { getFormattedDate } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ClaimFileUploadProps = StackScreenProps<ClaimsStackParamList, 'ClaimFileUpload'>

const ClaimFileUpload: FC<ClaimFileUploadProps> = ({ route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()
  const { claimID, currentPhase } = route.params
  const { claim } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const requests = currentRequestsForVet(claim?.attributes.eventsTimeline || [])

  // need to get the claim to check the waiverSubmitted field, so that if a claim decision is submitted
  // and waiverSubmitted is updated, the updated waiverSubmitted field will be used to hide the request
  // decision alert. also needed to keep track of if/when files were uploaded for a request
  useEffect(() => {
    dispatch(getClaim(claimID))
  }, [dispatch, claimID])

  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(claim?.attributes.eventsTimeline || [])

  const uploadedDateDisplayed = (date: string): ReactElement => {
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <VAIcon name="CircleCheckMark" fill="dark" width={18} height={18} />
        <TextView variant="MobileBodyBold" accessibilityRole="header" ml={theme.dimensions.textIconMargin}>
          {t('fileUpload.uploadedDate', { date: getFormattedDate(date, 'MM/dd/yy') })}
        </TextView>
      </Box>
    )
  }

  const getUploadRequests = (): ReactElement[] => {
    return _.map(requests, (request, index) => {
      const { displayName, uploaded, uploadDate, description } = request

      return (
        <Box mt={theme.dimensions.marginBetweenCards} key={index}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.marginBetweenCards}>
              {displayName}
            </TextView>
            {uploaded && uploadDate && uploadedDateDisplayed(uploadDate)}
            <TextView variant="MobileBody" mb={theme.dimensions.marginBetween}>
              {description}
            </TextView>
            {!uploaded && (
              <Box>
                <VAButton
                  onPress={navigateTo('SelectFile', { request })}
                  label={t('fileUpload.selectAFile')}
                  testID={t('fileUpload.selectAFile')}
                  textColor="primaryContrast"
                  backgroundColor="button"
                  a11yHint={t('fileUpload.selectAFileA11yHint')}
                />
                <Box mt={theme.dimensions.marginBetweenCards}>
                  <VAButton
                    onPress={navigateTo('TakePhotos', { request })}
                    label={t('fileUpload.takePhotos')}
                    testID={t('fileUpload.takePhotos')}
                    textColor="altButton"
                    backgroundColor="textBox"
                    borderColor="secondary"
                    a11yHint={t('fileUpload.takePhotosA11yHint')}
                  />
                </Box>
              </Box>
            )}
          </TextArea>
        </Box>
      )
    })
  }

  const canRequestDecision = !claim?.attributes.waiverSubmitted && currentPhase === 3

  return (
    <ScrollView {...testIdProps('Claim-file-upload-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('fileUpload.uploadFileToClaim')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.toHelpUs')}</TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween}>
            {t('fileUpload.maxFileSize')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.50MB')}</TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween}>
            {t('fileUpload.acceptedFileTypes')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
        </TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween} mx={theme.dimensions.gutter}>
          {t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })}
        </TextView>
        {getUploadRequests()}
        {canRequestDecision && (
          <Box mt={theme.dimensions.marginBetween} mx={theme.dimensions.gutter}>
            <AlertBox title={t('fileUpload.askForYourClaimDecision')} text={t('fileUpload.youCanAskUs')} border="informational" background="noCardBackground">
              <Box mt={theme.dimensions.marginBetween}>
                <VAButton
                  onPress={navigateTo('AskForClaimDecision', { claimID })}
                  label={t('fileUpload.viewDetails')}
                  testID={t('fileUpload.viewDetails')}
                  textColor="primaryContrast"
                  backgroundColor="button"
                  a11yHint={t('fileUpload.viewDetailsA11yHint')}
                />
              </Box>
            </AlertBox>
          </Box>
        )}
      </Box>
    </ScrollView>
  )
}

export default ClaimFileUpload
