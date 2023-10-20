import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import {
  Box,
  ButtonTypesConstants,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
  TextArea,
  TextView,
  VABulletList,
  VAButton,
} from 'components'
import { ClaimTypeConstants } from 'screens/BenefitsScreen/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { ClaimsAndAppealsState, submitClaimDecision } from 'store/slices'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { useAppDispatch, useDestructiveActionSheet, useError, useTheme } from 'utils/hooks'

type AskForClaimDecisionProps = StackScreenProps<BenefitsStackParamList, 'AskForClaimDecision'>

const AskForClaimDecision: FC<AskForClaimDecisionProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const { claimID } = route.params
  const { submittedDecision, error, claim, loadingSubmitClaimDecision } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const [haveSubmittedEvidence, setHaveSubmittedEvidence] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const { standardMarginBetween, contentMarginBottom, gutter } = theme.dimensions
  const requestEvalAlert = useDestructiveActionSheet()

  const navigateToClaimsDetailsPage = submittedDecision && !error
  const isClosedClaim = claim?.attributes.decisionLetterSent && !claim?.attributes.open
  const claimType = isClosedClaim ? ClaimTypeConstants.CLOSED : ClaimTypeConstants.ACTIVE
  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(claim?.attributes.eventsTimeline || [])

  useEffect(() => {
    if (navigateToClaimsDetailsPage) {
      navigation.navigate('ClaimDetailsScreen', { claimID, claimType, focusOnSnackbar: true })
    }
  }, [navigateToClaimsDetailsPage, navigation, claimID, claimType])

  if (useError(ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID)) {
    return (
      <FullScreenSubtask leftButtonText={t('cancel')} title={t('askForClaimDecision.pageTitle')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID} />
      </FullScreenSubtask>
    )
  }

  const onCancelPress = () => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval_cancel(claim.id, claim.attributes.claimType, claim.attributes.phase, numberOfRequests))
    }
    navigation.goBack()
  }

  const onSelectionChange = (value: boolean) => {
    if (claim && value) {
      logAnalyticsEvent(Events.vama_claim_eval_check(claim.id, claim.attributes.claimType, numberOfRequests))
    }
    setHaveSubmittedEvidence(value)
  }

  if (loadingSubmitClaimDecision) {
    return (
      <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={onCancelPress} title={t('askForClaimDecision.pageTitle')}>
        <LoadingComponent text={t('askForClaimDecision.loading')} />
      </FullScreenSubtask>
    )
  }

  const bulletedListOfText = [
    { text: t('askForClaimDecision.whetherYouGetVABenefits'), a11yLabel: a11yLabelVA(t('askForClaimDecision.whetherYouGetVABenefits')) },
    { text: t('askForClaimDecision.paymentAmount') },
    { text: t('askForClaimDecision.whetherYouGetOurHelp') },
    { text: t('askForClaimDecision.dateBenefits') },
  ]

  const onSubmit = (): void => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval_submit(claim.id, claim.attributes.claimType, numberOfRequests))
    }
    dispatch(submitClaimDecision(claimID, ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID))
  }

  const onRequestEvaluation = (): void => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval_conf(claim.id, claim.attributes.claimType, numberOfRequests))
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
    <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={onCancelPress} title={t('askForClaimDecision.pageTitle')} testID="askForClaimDecisionPageTestID">
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
          <VABulletList listOfText={bulletedListOfText} />
        </TextArea>
        <Box mx={gutter}>
          <Box my={standardMarginBetween}>
            <FormWrapper fieldsList={formFieldsList} onSave={onRequestEvaluation} setOnSaveClicked={setOnSaveClicked} onSaveClicked={onSaveClicked} />
          </Box>
          <VAButton
            onPress={(): void => setOnSaveClicked(true)}
            label={t('askForClaimDecision.submit')}
            testID={t('askForClaimDecision.submit')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default AskForClaimDecision
