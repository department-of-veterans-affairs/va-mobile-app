import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Box, ButtonTypesConstants, ErrorComponent, FieldType, FormFieldType, FormWrapper, TextArea, TextView, VABulletList, VAButton, VAScrollView } from 'components'
import { ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { ClaimsAndAppealsState, submitClaimDecision } from 'store/slices'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useError, useTheme, useTranslation } from 'utils/hooks'

type AskForClaimDecisionProps = StackScreenProps<ClaimsStackParamList, 'AskForClaimDecision'>

const AskForClaimDecision: FC<AskForClaimDecisionProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const dispatch = useAppDispatch()
  const { claimID } = route.params
  const { submittedDecision, error, claim } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const [haveSubmittedEvidence, setHaveSubmittedEvidence] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const { standardMarginBetween, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const { showActionSheetWithOptions } = useActionSheet()

  const displaySubmittedDecisionScreen = submittedDecision && !error
  const isClosedClaim = claim?.attributes.decisionLetterSent && !claim?.attributes.open
  const claimType = isClosedClaim ? ClaimTypeConstants.CLOSED : ClaimTypeConstants.ACTIVE

  useEffect(() => {
    if (displaySubmittedDecisionScreen) {
      navigation.navigate('ClaimDetailsScreen', { claimID, claimType, focusOnSnackbar: true })
    }
  }, [displaySubmittedDecisionScreen, navigation, claimID, claimType])

  if (useError(ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID} />
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
    const options = [t('askForClaimDecision.alertBtnTitle'), t('common:cancel')]
    showActionSheetWithOptions(
      {
        message: t('askForClaimDecision.alertTitle'),
        options,
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            onSubmit()
            break
        }
      },
    )
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        selected: haveSubmittedEvidence,
        onSelectionChange: setHaveSubmittedEvidence,
        labelKey: 'claims:askForClaimDecision.haveSubmittedAllEvidence',
        a11yLabel: t('askForClaimDecision.haveSubmittedAllEvidenceA11yLabel'),
        a11yHint: t('askForClaimDecision.haveSubmittedAllEvidenceA11yHint'),
        isRequiredField: true,
      },
      fieldErrorMessage: t('askForClaimDecision.checkToConfirmInformation'),
    },
  ]

  return (
    <VAScrollView {...testIdProps(generateTestID(t('askForClaimDecision.pageTitle'), ''))}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" mb={standardMarginBetween}>
            {t('askForClaimDecision.title')}
          </TextView>
          <TextView variant="MobileBody">{t('askForClaimDecision.weSentYouALetter')}</TextView>
          <TextView variant="MobileBody" my={standardMarginBetween}>
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
    </VAScrollView>
  )
}

export default AskForClaimDecision
