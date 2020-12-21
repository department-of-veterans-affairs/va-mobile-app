import React, { FC } from 'react'

import _ from 'underscore'

import { useTheme } from 'utils/hooks'
import Box from './Box'
import TextView, { FontVariant } from './TextView'
import VAIcon from './VAIcon'

/**
 * Props for {@link VABulletList}
 */
export type VABulletListProps = {
  /** list of text to display in a bulleted list*/
  listOfText: Array<string>

  /** optional variant for text, defaults to regular */
  variant?: FontVariant
}

/**
 * Displays the list of text as a bulleted list
 */
const VABulletList: FC<VABulletListProps> = ({ listOfText, variant }) => {
  const theme = useTheme()

  return (
    <Box>
      {_.map(listOfText, (text, index) => {
        return (
          <Box display="flex" flexDirection="row" alignItems="center" key={index}>
            <Box mr={theme.dimensions.textXPadding}>
              <VAIcon name="Bullet" fill="dark" />
            </Box>
            <TextView variant={variant || 'MobileBody'}>{text.trim()}</TextView>
          </Box>
        )
      })}
    </Box>
  )
}

export default VABulletList
