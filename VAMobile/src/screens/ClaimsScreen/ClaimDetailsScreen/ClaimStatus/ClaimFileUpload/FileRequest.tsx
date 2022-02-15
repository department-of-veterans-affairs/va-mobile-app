import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { map } from 'underscore'
import { useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ButtonTypesConstants, ErrorComponent, SimpleList, SimpleListItemObj, TextArea, TextView, VAButton, VAScrollView } from 'components'
import { ClaimsAndAppealsState, getClaim } from 'store/slices/claimsAndAppealsSlice'
import { ClaimsStackParamList } from '../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { currentRequestsForVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type FileRequestProps = StackScreenProps<ClaimsStackParamList, 'FileRequest'>

const FileRequest: FC<FileRequestProps> = ({ route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const { claimID } = route.params
  const { claim } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const requests = currentRequestsForVet(claim?.attributes.eventsTimeline || [])
  const { condensedMarginBetween, contentMarginBottom, contentMarginTop, standardMarginBetween, gutter } = theme.dimensions

  // need to get the claim to keep track of if/when files were uploaded for a request
  useEffect(() => {
    dispatch(getClaim(claimID, ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID))
  }, [dispatch, claimID])

  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(claim?.attributes.eventsTimeline || [])

  const getRequests = (): Array<SimpleListItemObj> => {
    // move uploaded requests to the end
    requests.push(
      requests.splice(
        requests.findIndex((r) => r.uploaded === true),
        1,
      )[0],
    )

    let requestNumber = 1

    return map(requests, (request) => {
      const { displayName, uploaded } = request

      const item = { text: displayName || '', onPress: navigateTo('FileRequestDetails', { request }), claimsRequestNumber: requestNumber, fileUploaded: uploaded }

      if (!uploaded) {
        requestNumber++
      }

      return item
    })
  }

  if (useError(ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID} />
  }

  return (
    <VAScrollView {...testIdProps('file-request-page')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          mt={standardMarginBetween}
          mb={condensedMarginBetween}
          mx={gutter}
          accessibilityLabel={t(`claimPhase.youHaveFileRequestA11yHints${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })}>
          {t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })}
        </TextView>
        <Box>
          <SimpleList items={getRequests()} />
        </Box>
        <TextView mt={condensedMarginBetween} mx={gutter} mb={contentMarginBottom} variant="MobileBody" accessibilityRole="header">
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
    </VAScrollView>
  )
}

export default FileRequest
