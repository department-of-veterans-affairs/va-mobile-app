import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect } from 'react'

import { BackButton, BackButtonLabelConstants, Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type ManageYourAccountProps = StackScreenProps<ProfileStackParamList, 'ManageYourAccount'>

const ManageYourAccount: FC<ManageYourAccountProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.SETTINGS)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('manageAccount.titlePage')} accessibilityRole="header" />,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} a11yHint={t('settings.backButton.a11yHint')} />
      ),
    })
  })

  return (
    <ScrollView {...testIdProps('Manage-your-account-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('manageAccount.title')}
          </TextView>
          <TextView variant="MobileBody">{t('manageAccount.toViewEditEmailGoToSite')}</TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default ManageYourAccount
