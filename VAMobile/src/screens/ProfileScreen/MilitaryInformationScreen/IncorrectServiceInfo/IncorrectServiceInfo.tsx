import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { ClickForActionLink, TextArea, TextView } from 'components'
import { ProfileStackParamList } from '../../ProfileScreen'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

type IncorrectServiceInfoScreenProps = StackScreenProps<ProfileStackParamList, 'IncorrectServiceInfo'>

/**
 * View for What If screen
 *
 * Returns incorrectServiceInfoScreen component
 */
const IncorrectServiceInfo: FC<IncorrectServiceInfoScreenProps> = ({ navigation }) => {
  const t = useTranslation('profile')

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('militaryInformation.incorrectServiceInfo.header')} accessibilityRole="header" />,
    })
  })

  return (
    <ScrollView {...testIdProps('Incorrect-Service-Info-screen')}>
      <TextArea>
        <TextView color="primary" variant="MobileBodyBold">
          {t('militaryInformation.incorrectServiceInfo')}
        </TextView>
        <TextView color="primary" variant="MobileBody" mt={8} mb={8}>
          {t('militaryInformation.incorrectServiceInfo.body')}
        </TextView>
        <ClickForActionLink
          displayedText={t('militaryInformation.incorrectServiceInfo.DMDCNumberDisplayed')}
          numberOrUrlLink={t('militaryInformation.incorrectServiceInfo.DMDCNumber')}
          linkType="call"
          {...a11yHintProp(t('militaryInformation.incorrectServiceInfo.DMDCNumber.a11yHint'))}
        />
      </TextArea>
    </ScrollView>
  )
}

export default IncorrectServiceInfo
