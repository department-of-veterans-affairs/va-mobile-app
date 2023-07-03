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
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { useAppDispatch, useDestructiveAlert, useError, useTheme } from 'utils/hooks'

type AskForClaimDecisionProps = StackScreenProps<BenefitsStackParamList, 'AskForClaimDecision'>

const AskForClaimDecision: FC<AskForClaimDecisionProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const { claimID } = route.params
  const { submittedDecision, error, claim, loadingSubmitClaimDecision } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const [haveSubmittedEvidence, setHaveSubmittedEvidence] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const { standardMarginBetween, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const requestEvalAlert = useDestructiveAlert()

  const navigateToClaimsDetailsPage = submittedDecision && !error
  const isClosedClaim = claim?.attributes.decisionLetterSent && !claim?.attributes.open
  const claimType = isClosedClaim ? ClaimTypeConstants.CLOSED : ClaimTypeConstants.ACTIVE

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

  if (loadingSubmitClaimDecision) {
    return (
      <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack} title={t('askForClaimDecision.pageTitle')}>
        <LoadingComponent text={t('askForClaimDecision.loading')} />
      </FullScreenSubtask>
    )
  }

  const bulletedListOfText = [
    { text: t('askForClaimDecision.whetherYouGetVABenefits'), a11yLabel: t('askForClaimDecision.whetherYouGetVABenefitsA11yLabel') },
    { text: t('askForClaimDecision.paymentAmount') },
    { text: t('askForClaimDecision.whetherYouGetOurHelp') },
    { text: t('askForClaimDecision.dateBenefits') },
  ]

  const onSubmit = (): void => {
    dispatch(submitClaimDecision(claimID, ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID))
  }

  const onRequestEvaluation = (): void => {
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
        onSelectionChange: setHaveSubmittedEvidence,
        labelKey: 'common:askForClaimDecision.haveSubmittedAllEvidence',
        a11yLabel: t('askForClaimDecision.haveSubmittedAllEvidenceA11yLabel'),
        a11yHint: t('askForClaimDecision.haveSubmittedAllEvidenceA11yHint'),
        isRequiredField: true,
      },
      fieldErrorMessage: t('askForClaimDecision.checkToConfirmInformation'),
    },
  ]

  return (
    <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack} title={t('askForClaimDecision.pageTitle')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
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
            a11yHint={t('askForClaimDecision.submitA11yHint')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default AskForClaimDecision
