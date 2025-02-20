import React from 'react'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps, TextView } from 'components'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'

type WebviewTitleProps = {
  title: string
}
function WebviewTitle({ title }: WebviewTitleProps) {
  const theme = useTheme()

  const titleBoxProps: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    height: isIOS() ? 'auto' : '100%',
    alignItems: 'center',
    accessible: true,
    accessibilityRole: 'header',
  }

  return (
    <Box accessibilityLabel={title} {...titleBoxProps}>
      <Box mr={theme.dimensions.textIconMargin}>
        <Icon name={'Lock'} height={36} width={24} fill={theme.colors.text.webviewTitle} preventScaling={true} />
      </Box>
      <TextView variant="webviewTitle" color="webviewTitle" allowFontScaling={false}>
        {title}
      </TextView>
    </Box>
  )
}

export default WebviewTitle
