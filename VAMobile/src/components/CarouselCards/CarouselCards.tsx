import React, { FC, useRef, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { PanGestureHandlerProps } from 'react-native-gesture-handler'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Box from 'components/Box'
import Card, { CardDataValue } from 'components/CarouselCards/Card'

type CarouselCardsProps = {
  data: CardDataValue[]
}

const modeConfig = {
  // This prevents the parallax mode from adjusting the size of the cards
  parallaxScrollingScale: 1,
  // This is the amount of space between the actual carousel items.
  // This combined with the item padding lets us see part of the next and previous cards
  parallaxScrollingOffset: 24,
}

// This adjusts the angle at which the sideswipe will be triggered, improving the interaction
// between swiping vertically to scroll on the page and swiping horizontally to change cards
const panGestureHandlerProps: PanGestureHandlerProps = {
  activeOffsetX: [-10, 10],
}

const CarouselCards: FC<CarouselCardsProps> = ({ data }) => {
  const ref = useRef<ICarouselInstance>(null)
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const [currentIndex, setCurrentIndex] = useState(0)

  const carouselStyles = { width: width - insets.right - insets.left, height: 272 }

  return (
    <Box key={'box-1'} flex={1}>
      <Carousel
        ref={ref}
        data={data}
        renderItem={(props) => (
          <Box key='box-2' accessible={true} importantForAccessibility="yes" flex={1}>
            <Card {...props} currentIndex={currentIndex} total={data.length} containerRef={ref} />
          </Box>
        )}
        loop={false}
        width={width - insets.right - insets.left}
        style={carouselStyles}
        mode="parallax"
        onSnapToItem={(index) => {
          setCurrentIndex(index)
        }}
        modeConfig={modeConfig}
        panGestureHandlerProps={panGestureHandlerProps}
      />
    </Box>
  )
}

export default CarouselCards
