import React, { FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';



import { Button } from '@department-of-veterans-affairs/mobile-component-library';
import { Icon } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon';
import { colors } from '@department-of-veterans-affairs/mobile-tokens';



import Box from 'components/Box';
import { TextView } from 'components/index';
import { NAMESPACE } from 'constants/namespaces';


export type RealCarouselCardData = {
  id: string
  title: string
  content: React.ReactNode
  onDismiss: () => Promise<void> | void
  onAction?: () => void
}

type RealCarouselCardProps = {
  item: RealCarouselCardData
  index: number
  total: number
  itemWidth: number
  listRef: RefObject<FlatList<RealCarouselCardData>>
  onDismiss: () => void
}

const cardHeight = 272

const RealCarouselCard: FC<RealCarouselCardProps> = ({ item, index, total, itemWidth, listRef, onDismiss }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const positionLabel = t('carousel.label.position', { index: index + 1, total })

  // When dismissing the last card we need to move to the previous card
  const onDismissPress = () => {
    if (index === total - 1 && index !== 0) {
      listRef.current?.scrollToIndex({ index: index - 1, animated: true })
    }
    setTimeout(() => {
      onDismiss()
    }, 200)
  }

  return (
    <Animated.View style={[styles.cardContainer, { width: itemWidth, minHeight: cardHeight }]}>
      <Box style={styles.card}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <TextView variant="vadsFontBodyXsmall">{positionLabel}</TextView>
          <Pressable accessible accessibilityRole="button" onPress={onDismissPress}>
            <Icon name="Close" fill="default" width={24} height={24} preventScaling={true} />
          </Pressable>
        </Box>
        <TextView mt={8} variant="vadsFontHeadingXsmall">
          {item.title}
        </TextView>
        <Box mt={8} flex={1} justifyContent="space-between">
          <Box>{item.content}</Box>
          {item.onAction && <Button onPress={item.onAction} label={t('whatsNew.goToFeature')} />}
        </Box>
      </Box>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.vadsColorWhite,
    shadowColor: colors.vadsColorBlack,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
})

export default RealCarouselCard
