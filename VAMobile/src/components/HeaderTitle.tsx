import { StyleSheet, View } from 'react-native'
import { TextView } from 'components'
import { useTheme } from 'utils/hooks'
import React, { FC, Ref } from 'react'

export type HeaderTitleProps = {
  /** ref for this component*/
  focusRef?: Ref<View>
  /**sets the header title*/
  headerTitle?: string
  /** sets if it is accessible*/
  accessible?: boolean
  /** sets the test id*/
  testID?: string
  /**sets the accessibility label*/
  accessabilityLabel?: string
}

/**Common component used for the navigation header title*/
const HeaderTitle: FC<HeaderTitleProps> = ({ focusRef, headerTitle, testID, accessabilityLabel, accessible = true }) => {
  const {
    dimensions: { headerHeight },
  } = useTheme()

  const combinestyle = StyleSheet.flatten([{ height: headerHeight }, defaultStyle.headerText])
  return (
    <View ref={focusRef} accessibilityRole="header" accessible={accessible} style={combinestyle} testID={testID} accessibilityLabel={accessabilityLabel}>
      <TextView accessible={false} importantForAccessibility={'no'} color={'primaryContrast'} allowFontScaling={false}>
        {headerTitle}
      </TextView>
    </View>
  )
}

const defaultStyle = StyleSheet.create({
  headerText: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
})
export default HeaderTitle
