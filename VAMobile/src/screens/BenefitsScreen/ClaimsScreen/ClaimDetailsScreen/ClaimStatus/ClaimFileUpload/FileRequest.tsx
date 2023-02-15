import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { map } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, ButtonTypesConstants, ChildTemplate, ErrorComponent, SimpleList, SimpleListItemObj, TextArea, TextView, VAButton } from 'components'
import { ClaimsAndAppealsState } from 'store/slices/claimsAndAppealsSlice'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { currentRequestsForVet, hasUploadedOrReceived, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'

type FileRequestProps = StackScreenProps<BenefitsStackParamList, 'FileRequest'>

const FileRequest: FC<FileRequestProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { claimID } = route.params
  const { claim } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const requests = currentRequestsForVet(claim?.attributes.eventsTimeline || [])
  const { condensedMarginBetween, contentMarginBottom, contentMarginTop, standardMarginBetween, gutter } = theme.dimensions

  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(claim?.attributes.eventsTimeline || [])

  const getRequests = (): Array<SimpleListItemObj> => {
    let requestNumber = 1

    return map(requests, (request) => {
      const { displayName } = request
      const hasUploaded = hasUploadedOrReceived(request)
      const item: SimpleListItemObj = {
        text: displayName || '',
        testId: displayName,
        onPress: navigateTo('FileRequestDetails', { request }),
        claimsRequestNumber: requestNumber,
        fileUploaded: hasUploaded,
        a11yHintText: t('fileRequest.buttonA11yHint'),
      }

      if (!hasUploaded) {
        requestNumber++
      }

      return item
    })
  }

  if (useError(ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID)) {
    return (
      <ChildTemplate backLabel={t('claim.backLabel')} backLabelOnPress={navigation.goBack} title={t('fileRequest.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID} />
      </ChildTemplate>
    )
  }

  return (
    <ChildTemplate backLabel={t('claim.backLabel')} backLabelOnPress={navigation.goBack} title={t('fileRequest.title')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" mt={standardMarginBetween} mb={condensedMarginBetween} mx={gutter}>
          {t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })}
        </TextView>
        <Box>
          <SimpleList items={getRequests()} />
        </Box>
        <TextView mt={condensedMarginBetween} mx={gutter} mb={contentMarginBottom} variant="HelperText" accessibilityRole="header">
          {t('fileRequest.weSentYouALaterText')}
        </TextView>
        <Box mt={standardMarginBetween}>
          <TextArea>
            <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
              {t('fileRequest.askForYourClaimEvaluationTitle')}
            </TextView>
            <TextView variant="MobileBody">{t('fileRequest.askForYourClaimEvaluationBody')}</TextView>
            <Box mt={standardMarginBetween}>
              <VAButton
                onPress={navigateTo('AskForClaimDecision', { claimID })}
                label={t('fileRequest.viewEvaluationDetails')}
                testID={t('fileRequest.viewEvaluationDetails')}
                buttonType={ButtonTypesConstants.buttonPrimary}
                a11yHint={t('fileRequest.viewEvaluationDetails')}
              />
            </Box>
          </TextArea>
        </Box>
      </Box>
    </ChildTemplate>
  )
}

export default FileRequest
