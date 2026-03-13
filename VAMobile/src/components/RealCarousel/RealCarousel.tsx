import React, { FC, useCallback, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



import { spacing } from '@department-of-veterans-affairs/mobile-tokens';



import Box from 'components/Box';
import RealCarouselCard, { RealCarouselCardData } from 'components/RealCarousel/RealCarouselCard';
import theme from 'styles/themes/standardTheme';


type RealCarouselProps = {
  data: RealCarouselCardData[]
}

const cardGap = 8

// Returns the width of the card at the index. the first and last items get additional width
const getCarouselCardWidth = (width: number, index: number, total: number) => {
  let itemWidth = width - cardGap * 4

  if (index === 0) {
    itemWidth += cardGap * 2
  }
  if (index === total - 1) {
    itemWidth += cardGap * 2
  }

  return itemWidth
}

// returns a list of offset points that the carousel will snap to. These correspond to the center of each card
// adjusting for the gaps and partial views of the next and previous cards
const useSnapToOffsets = (total: number, width: number) => {
  return useMemo(() => {
    const snapToOffsets = [0]

    if (total > 1) {
      const firstItemWidth = getCarouselCardWidth(width, 0, total)

      for (let i = 0; i <= total; i++) {
        const itemWidth = getCarouselCardWidth(width, i + 1, total)
        snapToOffsets.push(firstItemWidth + itemWidth * i + cardGap * (i - 1))
      }
    }

    return snapToOffsets
  }, [total, width])
}

const RealCarousel: FC<RealCarouselProps> = ({ data }) => {
  const listRef = useRef<FlatList<RealCarouselCardData>>(null)
  const { width } = useWindowDimensions()
  const  insets = useSafeAreaInsets()
  const snapToOffsets = useSnapToOffsets(data.length, width - insets.right - insets.left)

  const renderItem = useCallback(
    ({ item, index }) => {
      const itemWidth = getCarouselCardWidth(width - insets.right - insets.left, index, data.length)

      return (
        <RealCarouselCard
          key={index}
          item={item}
          index={index}
          total={data.length}
          itemWidth={itemWidth}
          listRef={listRef}
          onDismiss={item.onDismiss}
        />
      )
    },
    [data.length, width, insets],
  )

  return (
    <Animated.FlatList
      ref={listRef}
      horizontal
      data={data}
      renderItem={renderItem}
      snapToOffsets={snapToOffsets}
      disableIntervalMomentum
      decelerationRate='fast'
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <Box width={cardGap} />}
      style={styles.carousel}
    />
  )
}

const styles = StyleSheet.create({
  carousel: {
    paddingBottom: theme.dimensions.gutter,
    paddingTop: spacing.vadsSpaceSm,
  },
})

export default RealCarousel
