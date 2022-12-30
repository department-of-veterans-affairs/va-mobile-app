import { Animated, Easing, NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, StatusBar, Text, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { Box, DescriptiveBackButton, TextView, VAIcon, VAIconProps } from 'components'
import { VABackgroundColors } from 'styles/theme'
import { VAScrollViewProps } from 'components/VAScrollView'
import { themeFn } from 'utils/theme'
import { useTheme } from 'utils/hooks'
import styled from 'styled-components'

/* To use these templates:
1. Wrap the screen content you want in <FeatureLandingTemplate> </FeatureLandingTemplate> or <ChildTemplate> </ChildTemplate> and
  supply the appropriate props for desired functionality
2. In the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
  Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

type headerButton = {
  label: string
  labelA11y?: string
  icon: VAIconProps
  onPress: () => void
}

export type ChildTemplateProps = {
  backLabel: string
  backLabelA11y?: string
  backLabelOnPress: () => void
  title: string
  titleA11y?: string
  headerButton?: headerButton
  footerContent?: ReactNode // Content pinned below the scrollable space
  scrollViewProps?: VAScrollViewProps
}

export type FeatureLandingProps = ChildTemplateProps // Passthrough to same props

const HEADER_HEIGHT = 91
const SUBHEADER_HEIGHT = 52
const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT + SUBHEADER_HEIGHT

export const ChildTemplate: FC<ChildTemplateProps> = ({ backLabel, backLabelA11y, backLabelOnPress, title, titleA11y, headerButton, children, footerContent, scrollViewProps }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  const [initialScrollY] = useState(new Animated.Value(Platform.OS === 'ios' ? -TOTAL_HEADER_HEIGHT : 0))
  const scrollY = Animated.add(initialScrollY, Platform.OS === 'ios' ? TOTAL_HEADER_HEIGHT : 0)

  const [VaOpacity, setVaOpacity] = useState(1)

  const [titleShowing, setTitleShowing] = useState(false)
  const [titleFade] = useState(new Animated.Value(0))

  const subtitleTranslate = scrollY.interpolate({
    inputRange: [0, SUBHEADER_HEIGHT],
    outputRange: [0, -SUBHEADER_HEIGHT],
    extrapolate: 'clamp',
  })

  const updateOffset = (offsetValue: number) => {
    setVaOpacity(1 - offsetValue / SUBHEADER_HEIGHT)
    setTitleShowing(offsetValue > SUBHEADER_HEIGHT)
    // On fast scroll, pop in fully opaque title
    if (offsetValue > 4 * SUBHEADER_HEIGHT) {
      titleFade.setValue(1)
    }
  }

  useEffect(() => {
    titleShowing === false &&
      Animated.timing(titleFade, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start()

    titleShowing === true &&
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start()
  })

  const fillStyle: ViewStyle = {
    flex: 1,
  }

  // Copied from VAScrollView to address bug
  const scrollViewStyle: ViewStyle = {
    paddingRight: insets.right,
    paddingLeft: insets.left,
    backgroundColor: scrollViewProps?.backgroundColor ? theme.colors.background[scrollViewProps.backgroundColor as keyof VABackgroundColors] : theme.colors.background.main,
  }

  // Offsets content for header for Android
  const contentContainerStyle: ViewStyle = { paddingTop: Platform.OS === 'ios' ? 0 : TOTAL_HEADER_HEIGHT }

  const headerStyle: ViewStyle = {
    backgroundColor: theme.colors.background.main,
    paddingTop: Platform.OS === 'ios' ? 28 : 18,
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  }

  const subheaderStyle: ViewStyle = {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.main,
    overflow: 'hidden',
    height: SUBHEADER_HEIGHT,
    zIndex: 1,
  }

  const StyledLabel = styled(Text)`
	color: ${themeFn((styleTheme) => styleTheme.colors.icon.active)}
	align-self: center;
	margin-top: 24px;
	font-size: 12px;
	letter-spacing: -0.2px;
`

  return (
    <View style={fillStyle}>
      <StatusBar translucent barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background.main} />
      <Animated.View style={headerStyle}>
        <Box display="flex" flex={1} flexDirection={'row'} width="100%" height={theme.dimensions.headerHeight} alignItems={'center'}>
          <Box display="flex" width="25%">
            <DescriptiveBackButton label={backLabel} labelA11y={backLabelA11y} onPress={backLabelOnPress} />
          </Box>

          <Box
            display="flex"
            flex={1}
            flexDirection={'row'}
            m={theme.dimensions.headerButtonSpacing}
            justifyContent={'center'}
            alignItems={'center'}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants">
            {titleShowing ? (
              <Animated.View style={{ opacity: titleFade }}>
                <TextView variant="MobileBody" selectable={false} accessibilityLabel={titleA11y}>
                  {title}
                </TextView>
              </Animated.View>
            ) : (
              <TextView variant="BitterBoldHeading" selectable={false} opacity={VaOpacity}>
                VA
              </TextView>
            )}
          </Box>

          <Box display="flex" width="25%" alignItems="center">
            {headerButton ? (
              <Pressable onPress={headerButton.onPress} accessibilityRole="button" accessible={true}>
                <Box alignSelf="center" position="absolute" mt={theme.dimensions.buttonBorderWidth}>
                  <VAIcon name={headerButton.icon.name} fill={'active'} height={22} width={22} />
                </Box>
                <StyledLabel allowFontScaling={false}>{headerButton.label}</StyledLabel>
              </Pressable>
            ) : null}
          </Box>
        </Box>
      </Animated.View>

      <Animated.View style={[subheaderStyle, { transform: [{ translateY: subtitleTranslate }] }]}>
        <TextView variant="BitterBoldHeading" m={theme.dimensions.condensedMarginBetween}>
          {title}
        </TextView>
      </Animated.View>

      <>
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: initialScrollY } } }], {
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
              updateOffset(Platform.OS === 'ios' ? event.nativeEvent.contentOffset.y + TOTAL_HEADER_HEIGHT : event.nativeEvent.contentOffset.y)
            },
            useNativeDriver: true,
          })}
          // contentContainerStyle offsets content for header for Android
          contentContainerStyle={contentContainerStyle}
          // contentInset offsets content for header for iOS
          contentInset={{
            top: TOTAL_HEADER_HEIGHT,
          }}
          contentOffset={{
            x: 0,
            y: -TOTAL_HEADER_HEIGHT,
          }}
          // ref={scrollViewRef}
          scrollIndicatorInsets={{ right: 1 }}
          {...scrollViewProps}
          style={scrollViewStyle}>
          {children}
        </Animated.ScrollView>
        {footerContent}
      </>
    </View>
  )
}

export const FeatureLandingTemplate: FC<FeatureLandingProps> = ChildTemplate // Passthrough to same template component
