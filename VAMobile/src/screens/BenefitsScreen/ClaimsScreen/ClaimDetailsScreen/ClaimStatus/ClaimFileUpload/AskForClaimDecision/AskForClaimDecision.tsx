import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useClaim, useSubmitClaimDecision } from 'api/claimsAndAppeals'
import {
  Box,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  TextArea,
  TextView,
  VABulletList,
  VAScrollView,
} from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { useDestructiveActionSheet, useRouteNavigation, useTheme } from 'utils/hooks'

import { FileRequestStackParams } from '../FileRequestSubtask'

type AskForClaimDecisionProps = StackScreenProps<FileRequestStackParams, 'AskForClaimDecision'>

function AskForClaimDecision({ navigation, route }: AskForClaimDecisionProps) {
  const snackbar = useSnackbar()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { claimID } = route.params
  const { data: claim, error: loadingClaimError, refetch: refetchClaim, isFetching: loadingClaim } = useClaim(claimID)
  const {
    mutate: submitClaimDecision,
    error: error,
    isPending: loadingSubmitClaimDecision,
  } = useSubmitClaimDecision(claimID)
  const [haveSubmittedEvidence, setHaveSubmittedEvidence] = useState(false)
  const [submittedDecision, setSubmittedDecision] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const { standardMarginBetween, contentMarginBottom, gutter } = theme.dimensions
  const requestEvalAlert = useDestructiveActionSheet()
  const navigateTo = useRouteNavigation()

  const navigateToClaimsDetailsPage = submittedDecision && !error
  const isClosedClaim = claim?.attributes.decisionLetterSent && !claim?.attributes.open
  const claimType = isClosedClaim ? ClaimTypeConstants.CLOSED : ClaimTypeConstants.ACTIVE
  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(claim?.attributes.eventsTimeline || [])

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => onCancelPress(),
    leftButtonTestID: 'askForClaimDecisionBackID',
  })

  useEffect(() => {
    if (navigateToClaimsDetailsPage) {
      navigateTo('ClaimDetailsScreen', { claimID, claimType })
    }
  }, [navigateToClaimsDetailsPage, navigateTo, claimID, claimType])

  const onCancelPress = () => {
    if (claim) {
      logAnalyticsEvent(
        Events.vama_claim_eval_cancel(claim.id, claim.attributes.claimType, claim.attributes.phase, numberOfRequests),
      )
    }
    navigation.goBack()
  }

  const onSelectionChange = (value: boolean) => {
    if (claim && value) {
      logAnalyticsEvent(Events.vama_claim_eval_check(claim.id, claim.attributes.claimType, numberOfRequests))
    }
    setHaveSubmittedEvidence(value)
  }

  const bulletedListOfText = [
    {
      text: t('askForClaimDecision.whetherYouGetVABenefits'),
      a11yLabel: a11yLabelVA(t('askForClaimDecision.whetherYouGetVABenefits')),
    },
    { text: t('askForClaimDecision.paymentAmount') },
    { text: t('askForClaimDecision.whetherYouGetOurHelp') },
    { text: t('askForClaimDecision.dateBenefits') },
  ]

  const onSubmit = (): void => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval_conf(claim.id, claim.attributes.claimType, numberOfRequests))
    }
    const mutateOptions = {
      onSuccess: () => {
        setSubmittedDecision(true)
        snackbar.show(t('askForClaimDecision.requestSent'))
      },
      onError: () =>
        snackbar.show(t('askForClaimDecision.requestNotSent'), {
          isError: true,
          offset: theme.dimensions.snackBarBottomOffset,
          onActionPressed: () => onSubmit,
        }),
    }
    submitClaimDecision(claimID, mutateOptions)
  }

  const onRequestEvaluation = (): void => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval_submit(claim.id, claim.attributes.claimType, numberOfRequests))
    }
    requestEvalAlert({
      title: t('askForClaimDecision.alertTitle'),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('cancelRequest'),
        },
        {
          text: t('askForClaimDecision.alertBtnTitle'),
          onPress: onSubmit,
        },
      ],
    })
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        selected: haveSubmittedEvidence,
        onSelectionChange,
        labelKey: 'askForClaimDecision.haveSubmittedAllEvidence',
        a11yLabel: a11yLabelVA(t('askForClaimDecision.haveSubmittedAllEvidence')),
        isRequiredField: true,
      },
      fieldErrorMessage: t('askForClaimDecision.checkToConfirmInformation'),
    },
  ]

  return (
    <VAScrollView testID="askForClaimDecisionPageTestID">
      <SubtaskTitle title={t('askForClaimDecision.pageTitle')} />

      {loadingSubmitClaimDecision || loadingClaim ? (
        <LoadingComponent
          text={loadingSubmitClaimDecision ? t('askForClaimDecision.loading') : t('claimInformation.loading')}
        />
      ) : loadingClaimError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID}
          error={loadingClaimError}
          onTryAgain={refetchClaim}
        />
      ) : (
        <Box mb={contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header" mb={standardMarginBetween}>
              {t('askForClaimDecision.title')}
            </TextView>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('askForClaimDecision.weSentYouALetter')}
            </TextView>
            <TextView variant="MobileBody" mb={standardMarginBetween}>
              {t('askForClaimDecision.takingFull30Days')}
            </TextView>
            <VABulletList listOfText={bulletedListOfText} paragraphSpacing={true} />
          </TextArea>
          <Box mx={gutter}>
            <Box my={standardMarginBetween}>
              <FormWrapper
                fieldsList={formFieldsList}
                onSave={onRequestEvaluation}
                setOnSaveClicked={setOnSaveClicked}
                onSaveClicked={onSaveClicked}
              />
            </Box>
            <Button
              onPress={(): void => setOnSaveClicked(true)}
              label={t('askForClaimDecision.submit')}
              testID={t('askForClaimDecision.submit')}
            />
          </Box>
        </Box>
      )}
    </VAScrollView>
  )
}

export default AskForClaimDecision
