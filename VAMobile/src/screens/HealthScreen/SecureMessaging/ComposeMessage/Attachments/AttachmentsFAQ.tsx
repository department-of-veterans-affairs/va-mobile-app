import { BackButton, Box, TextView, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HeaderTitle, StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { HeaderTitleType } from 'styles/common'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC, ReactNode, useEffect } from 'react'

type AttachmentsFAQProps = StackScreenProps<HealthStackParamList, 'AttachmentsFAQ'>

const AttachmentsFAQ: FC<AttachmentsFAQProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const { header: displayTitle } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={false} />
      ),
      headerTitle: (header: HeaderTitleType) => (
        <Box {...testIdProps(displayTitle)} accessibilityRole="header" accessible={true}>
          <HeaderTitle {...header}>{displayTitle}</HeaderTitle>
        </Box>
      ),
    })
  })

  return (
    <VAScrollView>
      <Box my={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <TextView>{}</TextView>
      </Box>
    </VAScrollView>
  )
}
export default AttachmentsFAQ
