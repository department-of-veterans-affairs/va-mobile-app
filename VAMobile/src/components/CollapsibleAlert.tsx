import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextView } from 'components'
import { VABorderColors } from 'styles/theme'
import { useTheme } from 'utils/hooks'

export type CollapsibleAlertProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** accordion Header text */
  headerText: string
  /** accordion Body text */
  bodyText: string
  /** boolean for link on bottom */
  hasLink?: boolean
  /** Link text */
  linkText?: string
  /** Link URL */
  linkUrl?: string
  /** Accessibility Label */
  accessibilityLabel?: string
}

const CollapsibleAlert: FC<CollapsibleAlertProps> = ({ border, headerText, bodyText, hasLink, linkText, linkUrl, accessibilityLabel }) => {
  const theme = useTheme()

  const accordionHeader = (): ReactNode => {
    return (
      <Box>
        <TextView variant="MobileBodyBold" color={'primaryTitle'}>
          {headerText}
        </TextView>
      </Box>
    )
  }

  const accordionContent = (): ReactNode => {
    const linkToCallProps: LinkButtonProps = {
      displayedText: linkText || '',
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Arrow,
      numberOrUrlLink: linkUrl,
      accessibilityLabel: accessibilityLabel,
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody">{bodyText}</TextView>
        {hasLink ? <ClickForActionLink {...linkToCallProps} /> : null}
      </Box>
    )
  }

  return <AccordionCollapsible header={accordionHeader()} expandedContent={accordionContent()} testID={headerText} alertBorder={border} />
}

export default CollapsibleAlert
