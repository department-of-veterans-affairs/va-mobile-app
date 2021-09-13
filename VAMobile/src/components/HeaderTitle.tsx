import { StyleSheet, View } from 'react-native'
import { TextView } from 'components'
import { useTheme } from 'utils/hooks'
import React, { FC, Ref } from 'react'

export type HeaderTitleProps = {
  focusRef?: Ref<View>
  headerTitle: string
  accessible?: boolean
  testID?: string
  accessabilityLabel?: string
}

const HeaderTitle: FC<HeaderTitleProps> = ({ focusRef, headerTitle, testID, accessabilityLabel, accessible = true }) => {
  const {
    dimensions: { headerHeight },
  } = useTheme()

  const combinestyle = StyleSheet.flatten([{ height: headerHeight }, defaultStyle.headerText])
  return (
    <View ref={focusRef} accessibilityRole="header" accessible={accessible} style={combinestyle} testID={testID} accessibilityLabel={accessabilityLabel}>
      <TextView accessible={false} importantForAccessibility={'no'} color={'primaryContrast'}>
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
