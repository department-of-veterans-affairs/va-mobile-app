import { Box, BoxProps, TextView, VAIcon } from 'components'
import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import React, { FC } from 'react'

type WebviewTitleProps = {
  title: string
}
const WebviewTitle: FC<WebviewTitleProps> = ({ title }) => {
  const theme = useTheme()

  const titleBoxProps: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    height: isIOS() ? 'auto' : '100%',
    alignItems: 'center',
  }

  return (
    <Box {...titleBoxProps}>
      <Box mr={8}>
        <VAIcon name={'Lock'} height={20} width={17} fill={theme.colors.icon.contrast} preventScaling={true} />
      </Box>
      <TextView {...testIdProps('Webview-title')} color="primaryContrast" allowFontScaling={false}>
        {title}
      </TextView>
    </Box>
  )
}

export default WebviewTitle
