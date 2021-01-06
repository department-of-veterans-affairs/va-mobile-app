import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AlertBox, BackButton, Box, CheckBox, TextArea, TextView, VABulletList, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { submitClaimDecision } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type AskForClaimDecisionProps = StackScreenProps<ClaimsStackParamList, 'AskForClaimDecision'>

const AskForClaimDecision: FC<AskForClaimDecisionProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const dispatch = useDispatch()
  const { claimID } = route.params
  const { submittedDecision, error } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  const [haveSubmittedEvidence, setHaveSubmittedEvidence] = useState(false)
  const displaySubmittedDecisionScreen = submittedDecision && !error

  useEffect(() => {
    const title = displaySubmittedDecisionScreen ? t('askForClaimDecision.submittedClaim.pageTitle') : t('askForClaimDecision.pageTitle')
    const backA11yHint = displaySubmittedDecisionScreen ? t('askForClaimDecision.backA11yHint') : t('common:back.a11yHint')

    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={title} accessibilityRole="header" />,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} a11yHint={backA11yHint} />
      ),
    })
  }, [submittedDecision, navigation, t])

  if (displaySubmittedDecisionScreen) {
    return (
      <ScrollView {...testIdProps('Submitted-claim-decision-screen')}>
        <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <AlertBox title={t('askForClaimDecision.requestReceived')} text={t('askForClaimDecision.willMakeADecision')} border="success" background="noCardBackground" />
        </Box>
      </ScrollView>
    )
  }

  const bulletedListOfText = [
    t('askForClaimDecision.whetherYouGetVABenefits'),
    t('askForClaimDecision.paymentAmount'),
    t('askForClaimDecision.whetherYouGetOurHelp'),
    t('askForClaimDecision.dateBenefits'),
  ]

  const onSubmit = (): void => {
    dispatch(submitClaimDecision(claimID))
  }

  return (
    <ScrollView {...testIdProps('Ask-for-claim-decision-screen')}>
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
            <CheckBox
              selected={haveSubmittedEvidence}
              onSelectionChange={setHaveSubmittedEvidence}
              label={t('askForClaimDecision.haveSubmittedAllEvidence')}
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
