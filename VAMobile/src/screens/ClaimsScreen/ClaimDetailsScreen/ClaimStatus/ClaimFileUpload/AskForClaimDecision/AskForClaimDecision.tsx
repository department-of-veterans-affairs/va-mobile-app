import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AlertBox, BackButton, Box, ErrorComponent, TextArea, TextView, VABulletList, VAButton, VASelector } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimTypeConstants } from '../../../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { generateTestID } from 'utils/common'
import { submitClaimDecision } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type AskForClaimDecisionProps = StackScreenProps<ClaimsStackParamList, 'AskForClaimDecision'>

const AskForClaimDecision: FC<AskForClaimDecisionProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const dispatch = useDispatch()
  const { claimID } = route.params
  const { submittedDecision, error, claim } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const [haveSubmittedEvidence, setHaveSubmittedEvidence] = useState(false)

  const displaySubmittedDecisionScreen = submittedDecision && !error
  const isClosedClaim = claim?.attributes.decisionLetterSent && !claim?.attributes.open
  const claimType = isClosedClaim ? ClaimTypeConstants.CLOSED : ClaimTypeConstants.ACTIVE

  useEffect(() => {
    const title = displaySubmittedDecisionScreen ? t('askForClaimDecision.submittedClaim.pageTitle') : t('askForClaimDecision.pageTitle')
    const backA11yHint = displaySubmittedDecisionScreen ? t('askForClaimDecision.backA11yHint') : t('common:back.a11yHint')

    const onBack = (): void => {
      displaySubmittedDecisionScreen ? navigation.navigate('ClaimDetailsScreen', { claimID, claimType }) : navigation.goBack()
    }

    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={title} accessibilityRole="header">
          {title}
        </HiddenTitle>
      ),
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={onBack} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} a11yHint={backA11yHint} />
      ),
    })
  }, [displaySubmittedDecisionScreen, navigation, claimID, claimType, t])

  if (useError(ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (displaySubmittedDecisionScreen) {
    return (
      <ScrollView {...testIdProps(generateTestID(t('askForClaimDecision.submittedClaim.pageTitle'), ''))}>
        <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <AlertBox title={t('askForClaimDecision.requestReceived')} text={t('askForClaimDecision.willMakeADecision')} border="success" background="noCardBackground" />
        </Box>
      </ScrollView>
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

  return (
    <ScrollView {...testIdProps(generateTestID(t('askForClaimDecision.pageTitle'), ''))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('askForClaimDecision.title')}
          </TextView>
          <TextView variant="MobileBody">{t('askForClaimDecision.weSentYouALetter')}</TextView>
          <TextView variant="MobileBody" my={theme.dimensions.marginBetween}>
            {t('askForClaimDecision.takingFull30Days')}
          </TextView>
          <VABulletList listOfText={bulletedListOfText} />
          <Box my={theme.dimensions.marginBetween}>
            <VASelector
              selected={haveSubmittedEvidence}
              onSelectionChange={setHaveSubmittedEvidence}
              label={t('askForClaimDecision.haveSubmittedAllEvidence')}
              a11yLabel={t('askForClaimDecision.haveSubmittedAllEvidenceA11yLabel')}
              a11yHint={t('askForClaimDecision.haveSubmittedAllEvidenceA11yHint')}
            />
          </Box>
          <VAButton
            onPress={onSubmit}
            label={t('askForClaimDecision.submit')}
            testID={t('askForClaimDecision.submit')}
            a11yHint={t('askForClaimDecision.submitA11yHint')}
            backgroundColor="button"
            textColor="primaryContrast"
            disabled={!haveSubmittedEvidence}
          />
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default AskForClaimDecision
