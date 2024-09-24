import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Pressable, StyleSheet } from 'react-native'
import { SharedElement, SharedElementNode, SharedElementTransition } from 'react-native-shared-element'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { useTheme } from 'utils/hooks'

type ConsolidatedClaimsNoteProps = StackScreenProps<BenefitsStackParamList, 'ConsolidatedClaimsNote'>

function ConsolidatedClaimsNote({}: ConsolidatedClaimsNoteProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [progress, setProgress] = useState(new Animated.Value(0))
  const [isScene2Visible, setIsScene2Visible] = useState(false)
  const [isInProgress, setIsInProgress] = useState(false)
  const [scene2Ancestor, setScene2Ancestor] = useState<SharedElementNode | null>(null)
  const [scene2Node, setScene2Node] = useState<SharedElementNode | null>(null)
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.main,
    },
    scene: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
  const onPressNavigate = () => {
    setIsScene2Visible(true)
    setIsInProgress(true)
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setIsInProgress(false))
  }

  const onPressBack = () => {
    setIsInProgress(true)
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setIsScene2Visible(false)
      setIsInProgress(false)
    })
  }

  return (
    <LargePanel title={t('claimDetails.claimsHelp.pageTitle')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          onPress={() => {
            onPressNavigate()
          }}>
          {t('claimDetails.whyWeCombinePanel')}
        </TextView>
        <TextView variant="MobileBody">{t('claimDetails.consolidatedClaims.noteContent')}</TextView>
        {isScene2Visible ? (
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              transform: [
                {
                  scale: Animated.multiply(0.5, Animated.add(progress, 1)),
                },
              ],
            }}>
            <SharedElement style={styles.scene} onNode={setScene2Ancestor}>
              <SharedElement onNode={setScene2Node}>
                <Pressable style={styles.container} onPress={onPressBack}>
                  <TextView>What ever we want can go in this animation</TextView>
                </Pressable>
              </SharedElement>
            </SharedElement>
          </Animated.View>
        ) : undefined}
        {isInProgress ? (
          <Box>
            <SharedElementTransition
              start={{
                node: null,
                ancestor: null,
              }}
              end={{
                node: scene2Node,
                ancestor: scene2Ancestor,
              }}
              position={progress}
              animation="fade-out"
              resize="auto"
              align="auto"
            />
          </Box>
        ) : undefined}
      </Box>
    </LargePanel>
  )
}

export default ConsolidatedClaimsNote
