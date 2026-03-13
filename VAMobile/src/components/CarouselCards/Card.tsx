import React, { FC, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet, ViewStyle } from 'react-native'
import { ICarouselInstance } from 'react-native-reanimated-carousel'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { Icon } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import Box from 'components/Box'
import { TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'
import theme from 'styles/themes/standardTheme'

export type CardDataValue = {
  id: string
  title: string
  content: React.ReactNode
  onDismiss: () => Promise<void>
  onAction?: () => void
}

type CardProps = {
  containerRef: RefObject<ICarouselInstance>
  currentIndex: number
  index: number
  total: number
  item: CardDataValue
}

// getCardContainerStyles applies additional styling to the first and last cards to extend them where there is extra space
const getCardContainerStyles = (index: number, total: number) => {
  const cardContainerStyles: ViewStyle[] = [styles.cardContainer]

  if (index === 0) {
    cardContainerStyles.push(styles.firstCardContainer)
  }

  if (index === total - 1) {
    cardContainerStyles.push(styles.lastCardContainer)
  }

  return cardContainerStyles
}

const Card: FC<CardProps> = ({ index, total, item, containerRef }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const containerStyles = getCardContainerStyles(index, total)
  const positionLabel = t('carousel.label.position', { index: index + 1, total })

  const onDismiss = async () => {
    // The carousel does not automatically move to the left when dismissing the last card.
    // this manually scrolls to the previous item
    if (index === total - 1 && index !== 0) {
      containerRef.current?.scrollTo({ index: index - 1, animated: true })
    }

    return item.onDismiss()
  }

  return (
    <Box style={containerStyles}>
      <Box style={styles.card}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <TextView variant="vadsFontBodyXsmall">{positionLabel}</TextView>
          <Pressable accessible accessibilityRole="button" onPress={onDismiss}>
            <Icon name="Close" fill="default" width={24} height={24} preventScaling={true} />
          </Pressable>
        </Box>
        <TextView variant="vadsFontHeadingXsmall">{item.title}</TextView>
        <Box display="flex" justifyContent="space-between" flex={1}>
          <Box maxHeight={100}>
            {item.content}
          </Box>
          {item.onAction && <Button onPress={item.onAction} label={t('whatsNew.goToFeature')} />}
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
    position: 'relative',
  },
  firstCardContainer: {
    paddingLeft: 0,
  },
  lastCardContainer: {
    paddingRight: 0,
  },
  card: {
    flex: 1,
    display: 'flex',
    maxHeight: '90%',
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
  cardFocus: {
    position: 'absolute',
    height: '100%',
    width: 35,
    borderColor: 'green',
    borderWidth: 2,
  },
  nextCardFocus: {
    left: 30,
  },
  prevCardFocus: {
    right: 30,
  },
})

export default Card
