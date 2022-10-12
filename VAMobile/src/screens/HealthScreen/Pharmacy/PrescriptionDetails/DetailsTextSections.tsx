import React, { FC } from 'react'

import { Box, BoxProps, TextView } from 'components'
import { useTheme } from 'utils/hooks'

type DetailsTextSections = {
  /** set the header for the text on the left */
  leftSectionTitle: string
  /** set the header accessibility label for the text on the left */
  leftSectionTitleLabel?: string
  /** set the value for the text on the left */
  leftSectionValue?: string | number
  /** set the value accessibility label for the text on the left */
  leftSectionValueLabel?: string
  /** set the header for the text on the right */
  rightSectionTitle?: string
  /** set the header accessibility label for the text on the right */
  rightSectionTitleLabel?: string
  /** set the value for the text on the right */
  rightSectionValue?: string | number
  /** set the value accessibility label for the text on the right */
  rightSectionValueLabel?: string
}

/** Common component for the prescription details data sections */
const DetailsTextSections: FC<DetailsTextSections> = ({
  leftSectionTitle,
  leftSectionValue,
  leftSectionValueLabel,
  leftSectionTitleLabel,
  rightSectionTitle,
  rightSectionTitleLabel,
  rightSectionValue,
  rightSectionValueLabel,
  children,
}) => {
  const theme = useTheme()
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const getTextElements = (headerText: string, valueText?: string | number, headerLabel?: string, valueLabel?: string) => {
    return (
      <>
        <TextView accessibilityLabel={headerLabel} variant="MobileBodyBold">
          {headerText}
        </TextView>
        <TextView accessibilityLabel={valueLabel} variant="MobileBody">
          {valueText}
        </TextView>
      </>
    )
  }

  const hasRightText = !!rightSectionTitle

  const containerProps: BoxProps = hasRightText
    ? {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }
    : {}

  return (
    <Box mt={standardMarginBetween} borderTopWidth={1} borderTopColor={'prescriptionDivider'} pt={standardMarginBetween}>
      <Box {...containerProps}>
        <Box accessible={hasRightText ? true : false}>{getTextElements(leftSectionTitle, leftSectionValue, leftSectionTitleLabel, leftSectionValueLabel)}</Box>
        {hasRightText && (
          <Box alignItems="flex-end" accessible={true}>
            {getTextElements(rightSectionTitle, rightSectionValue, rightSectionTitleLabel, rightSectionValueLabel)}
          </Box>
        )}
      </Box>

      <Box mt={condensedMarginBetween}>{children}</Box>
    </Box>
  )
}

export default DetailsTextSections
