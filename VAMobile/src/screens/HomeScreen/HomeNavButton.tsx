import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Box, TextView, VAIcon } from 'components'
import { ViewFlexRowSpaceBetween } from 'styles/common'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { themeFn } from 'utils/theme'

const StyledView = styled(ViewFlexRowSpaceBetween)`
  width: 100%;
  min-height: 81px;
  border-radius: 6px;
  padding-top: 12px;
  padding-bottom: 15px;
  padding-left: 10px;
  padding-right: 14px;
  margin-bottom: 15px;
  background-color: ${themeFn((theme) => theme.colors.text.primaryContrast)};
`

interface HomeNavButtonProps {
  title: string
  subText: string
  a11yHint: string
  onPress: () => void
}

/**
 * Reusable menu item for the HomeScreen
 *
 * @param title - string for header and used to create testID for accessibility
 * @param subText - string secondary text that seats on the second row
 * @param onPress - function to be called when press occurs
 * @param a11yHint - string for accessibility hint
 *
 * @returns HomeNavButton component
 */
const HomeNavButton: FC<HomeNavButtonProps> = ({ title, subText, a11yHint, onPress }: HomeNavButtonProps) => {
  const _onPress = (): void => {
    onPress()
  }

  const testId = generateTestID(title, 'home-nav-button')

  return (
    <StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} {...a11yHintProp(a11yHint)}>
      <Box flex={1}>
        <TextView mb={10} variant="BitterBoldHeading" {...testIdProps(testId + '-title')}>
          {title}
        </TextView>
        <TextView {...testIdProps(testId + '-subtext')}>{subText}</TextView>
      </Box>
      <VAIcon name="ArrowRight" fill="#0071BC" width={10} height={15} />
    </StyledView>
  )
}

export default HomeNavButton
