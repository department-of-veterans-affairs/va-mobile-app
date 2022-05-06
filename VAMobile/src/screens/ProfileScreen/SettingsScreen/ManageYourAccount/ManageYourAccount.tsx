import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect } from 'react'

import { BackButton, Box, TextArea, TextView, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type ManageYourAccountProps = StackScreenProps<ProfileStackParamList, 'ManageYourAccount'>

const ManageYourAccount: FC<ManageYourAccountProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.SETTINGS)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('manageAccount.titlePage')} accessibilityRole="header">
          {t('manageAccount.titlePage')}
        </HiddenTitle>
      ),
      headerLeft: (props): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} a11yHint={t('settings.backButton.a11yHint')} />
      ),
    })
  })

  return (
    <VAScrollView {...testIdProps(generateTestID(t('manageAccount.titlePage'), ''))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('manageAccount.title')}
          </TextView>
          <TextView variant="MobileBody">{t('manageAccount.toConfirmOrUpdateEmail')}</TextView>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default ManageYourAccount
