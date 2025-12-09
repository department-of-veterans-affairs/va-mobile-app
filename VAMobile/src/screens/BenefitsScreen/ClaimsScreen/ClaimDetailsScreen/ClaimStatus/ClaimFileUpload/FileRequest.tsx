import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useClaim } from 'api/claimsAndAppeals'
import { ClaimEventData } from 'api/types'
import {
  Box,
  ErrorComponent,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
  TextView,
  VAScrollView,
} from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FileRequestStackParams } from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  currentRequestsForVet,
  hasUploadedOrReceived,
  is5103Notice,
  numberOfItemsNeedingAttentionFromVet,
} from 'utils/claims'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type FileRequestProps = StackScreenProps<FileRequestStackParams, 'FileRequest'>

function FileRequest({ navigation, route }: FileRequestProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { claimID, claim } = route.params
  const {
    data: claimFallBack,
    error: claimError,
    refetch: refetchClaim,
    isFetching: loadingClaim,
  } = useClaim(claimID, { enabled: !claim })
  const requests = currentRequestsForVet(
    claim?.attributes.eventsTimeline || claimFallBack?.attributes.eventsTimeline || [],
  )

  const { condensedMarginBetween, contentMarginBottom, gutter } = theme.dimensions

  useSubtaskProps({
    leftButtonText: t('cancel'),
    onLeftButtonPress: () => navigation.goBack(),
    leftButtonTestID: 'fileRequestPageBackID',
  })

  const count = numberOfItemsNeedingAttentionFromVet(
    claim?.attributes.eventsTimeline || claimFallBack?.attributes.eventsTimeline || [],
  )

  const getRequests = (): Array<SimpleListItemObj> => {
    let requestNumber = 1

    const onDetailsPress = (request: ClaimEventData) => {
      logAnalyticsEvent(Events.vama_request_details(claimID, request.trackedItemId || null, request.type))

      if (is5103Notice(request.displayName || '')) {
        navigateTo('File5103RequestDetails', { claimID, request })
      } else {
        navigateTo('FileRequestDetails', { claimID, request })
      }
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

  return (
    <VAScrollView testID="fileRequestPageTestID">
      <SubtaskTitle title={t('fileRequest.title')} />

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
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
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
        </Box>
      )}
    </VAScrollView>
  )
}

export default FileRequest
