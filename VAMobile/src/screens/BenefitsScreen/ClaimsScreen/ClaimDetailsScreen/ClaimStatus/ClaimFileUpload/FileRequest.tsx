import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { map } from 'underscore'

import { useClaim } from 'api/claimsAndAppeals'
import { ClaimEventData } from 'api/types'
import {
  Box,
  ErrorComponent,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
  TextArea,
  TextView,
  VAScrollView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { currentRequestsForVet, hasUploadedOrReceived, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import { FileRequestContext, FileRequestStackParams } from './FileRequestSubtask'

type FileRequestProps = StackScreenProps<FileRequestStackParams, 'FileRequest'>

function FileRequest({ navigation }: FileRequestProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { claimID, claim, setLeftButtonText, setOnLeftButtonPress } = useContext(FileRequestContext)
  const {
    data: claimFallBack,
    error: claimError,
    refetch: refetchClaim,
    isFetching: loadingClaim,
  } = useClaim(claimID, undefined, { enabled: !claim })
  const requests = currentRequestsForVet(
    claim?.attributes.eventsTimeline || claimFallBack?.attributes.eventsTimeline || [],
  )
  const { condensedMarginBetween, contentMarginBottom, standardMarginBetween, gutter } = theme.dimensions

  useFocusEffect(
    useCallback(() => {
      setLeftButtonText(t('cancel'))
      setOnLeftButtonPress(() => navigation.goBack)
    }, [navigation.goBack, setLeftButtonText, setOnLeftButtonPress, t]),
  )

  const count = numberOfItemsNeedingAttentionFromVet(
    claim?.attributes.eventsTimeline || claimFallBack?.attributes.eventsTimeline || [],
  )

  const getRequests = (): Array<SimpleListItemObj> => {
    let requestNumber = 1

    const onDetailsPress = (request: ClaimEventData) => {
      logAnalyticsEvent(Events.vama_request_details(claimID, request.trackedItemId || null, request.type))
      navigateTo('FileRequestDetails', { request })
    }

    const getA11yLabel = (requestIndex: number, displayName?: string, uploaded?: boolean) => {
      const nameContainsRequestNumber = displayName && /Request \d/.test(displayName)
      const status = uploaded ? t('uploaded') : t('needed')

      if (!displayName) {
        return `${t('fileRequest.buttonA11y', { requestNumber: requestIndex, totalCount: requests.length })} ${status}`
      }

      return nameContainsRequestNumber
        ? `${displayName} ${t('fileRequest.buttonA11y.totalCount', { totalCount: requests.length })} ${status}`
        : `${t('fileRequest.buttonA11y', { requestNumber: requestIndex, totalCount: requests.length })} ${status}. ${displayName}`
    }

    return map(requests, (request, index) => {
      const { displayName } = request
      const hasUploaded = hasUploadedOrReceived(request)
      const item: SimpleListItemObj = {
        text: displayName || '',
        testId: getA11yLabel(index + 1, displayName, hasUploaded),
        onPress: () => {
          onDetailsPress(request)
        },
        claimsRequestNumber: requestNumber,
        fileUploaded: hasUploaded,
        a11yHintText: hasUploaded ? t('fileRequest.buttonA11yHint.uploaded') : t('fileRequest.buttonA11yHint.needed'),
      }

      if (!hasUploaded) {
        requestNumber++
      }

      return item
    })
  }

  const viewEvaluationDetailsPress = () => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval(claim.id, claim.attributes.claimType, claim.attributes.phase, count))
    } else if (claimFallBack) {
      logAnalyticsEvent(
        Events.vama_claim_eval(
          claimFallBack.id,
          claimFallBack.attributes.claimType,
          claimFallBack.attributes.phase,
          count,
        ),
      )
    }
    navigateTo('AskForClaimDecision', { claimID })
  }

  return (
    <VAScrollView>
      {loadingClaim ? (
        <LoadingComponent text={t('claimsAndAppeals.loadingClaim')} />
      ) : claimError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID}
          error={claimError}
          onTryAgain={refetchClaim}
        />
      ) : (
        <Box mb={contentMarginBottom}>
          <TextView
            variant="MobileBodyBold"
            accessibilityRole="header"
            accessibilityLabel={a11yLabelVA(t('claimPhase.youHaveFileRequestVA', { count }))}
            mb={condensedMarginBetween}
            mx={gutter}>
            {t('claimPhase.youHaveFileRequestVA', { count })}
          </TextView>
          <Box>
            <SimpleList items={getRequests()} />
          </Box>
          <TextView
            mt={condensedMarginBetween}
            mx={gutter}
            mb={contentMarginBottom}
            variant="HelperText"
            accessibilityRole="header">
            {t('fileRequest.weSentYouALaterText')}
          </TextView>
          <Box mt={standardMarginBetween}>
            <TextArea>
              <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequest.askForYourClaimEvaluationTitle')}
              </TextView>
              <TextView variant="MobileBody" paragraphSpacing={true}>
                {t('fileRequest.askForYourClaimEvaluationBody')}
              </TextView>
              <Button
                onPress={viewEvaluationDetailsPress}
                label={t('fileRequest.viewEvaluationDetails')}
                testID={t('fileRequest.viewEvaluationDetails')}
                a11yHint={t('fileRequest.viewEvaluationDetails')}
              />
            </TextArea>
          </Box>
        </Box>
      )}
    </VAScrollView>
  )
}

export default FileRequest
