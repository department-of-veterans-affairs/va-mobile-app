import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect, useState } from 'react'

import { Box, CheckBox, TextArea, TextView, VABulletList, VAButton } from 'components'
import { ClaimsStackParamList } from '../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type AskForClaimDecisionProps = StackScreenProps<ClaimsStackParamList, 'AskForClaimDecision'>

const AskForClaimDecision: FC<AskForClaimDecisionProps> = ({ navigation }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const [haveSubmittedEvidence, setHaveSubmittedEvidence] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('askForClaimDecision.pageTitle')} accessibilityRole="header" />,
    })
  })

  const bulletedListOfText = [
    t('askForClaimDecision.whetherYouGetVABenefits'),
    t('askForClaimDecision.paymentAmount'),
    t('askForClaimDecision.whetherYouGetOurHelp'),
    t('askForClaimDecision.dateBenefits'),
  ]

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
            onPress={(): void => {}}
            label={t('askForClaimDecision.submit')}
            testID={t('askForClaimDecision.submit')}
            a11yHint={t('askForClaimDecision.submitA11yHint')}
            backgroundColor="button"
            textColor="primaryContrast"
            disabled={true}
          />
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default AskForClaimDecision
