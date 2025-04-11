import React, { FC, useEffect, useState } from 'react'
import { Animated, Easing, useAnimatedValue } from 'react-native'

import { Box, BoxProps, TextView, TextViewProps } from './index'

export type ObfuscatedTextViewProps = {
  /** If true, will show the revealed text */
  showText: boolean
  /** Text shown when in the obfuscated state */
  obfuscatedText: string
  /** Text shown when in the revealed state */
  revealedText: string
  /** Additional props added to the text view containing text in the revealed state */
  revealedTextProps: TextViewProps
  /** Additional props added to the text view containing text in the obfuscated state */
  obfuscatedTextProps: TextViewProps
}

/**
  ObfuscatedTextView allows text to be toggled between an obfuscated and revealed state
 */
const ObfuscatedTextView: FC<ObfuscatedTextViewProps> = ({
  showText,
  obfuscatedText,
  revealedText,
  revealedTextProps,
  obfuscatedTextProps,
}) => {
  const [obfuscatedFade] = useState(useAnimatedValue(showText ? 0 : 1))
  const [revealedFade] = useState(useAnimatedValue(showText ? 1 : 0))

  useEffect(() => {
    const animationProps = {
      duration: 75,
      useNativeDriver: true,
      easing: Easing.linear,
    }

    if (showText) {
      // Fade out obfuscated text and show revealed text
      Animated.sequence([
        Animated.timing(obfuscatedFade, {
          toValue: 0,
          ...animationProps,
        }),
        Animated.timing(revealedFade, {
          toValue: 1,
          ...animationProps,
        }),
      ]).start()
    } else {
      // Fade out revealed text and show obfuscated text
      Animated.sequence([
        Animated.timing(revealedFade, {
          toValue: 0,
          ...animationProps,
        }),
        Animated.timing(obfuscatedFade, {
          toValue: 1,
          ...animationProps,
        }),
      ]).start()
    }
  }, [showText, obfuscatedFade, revealedFade])

  const revealedBoxStyles: BoxProps = {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
  }

  return (
    <Box>
      <Box>
        <Animated.View style={{ opacity: obfuscatedFade }}>
          <TextView accessible={false} importantForAccessibility={'no'} {...obfuscatedTextProps}>
            {obfuscatedText}
          </TextView>
        </Animated.View>
      </Box>
      <Box {...revealedBoxStyles}>
        <Animated.View style={{ opacity: revealedFade }}>
          <TextView accessible={false} importantForAccessibility={'no'} {...revealedTextProps}>
            {revealedText}
          </TextView>
        </Animated.View>
      </Box>
    </Box>
  )
}

export default ObfuscatedTextView
