import React, { FC } from 'react'

import { ClickToCallPhoneNumber, TextView } from 'components'
import { useExternalLink } from 'utils/hooks'

type TranslatablePhoneNumber = {
  children?: React.ReactNode
  variant?: 'inline' | 'standalone' | 'tty'
}

const TranslatablePhoneNumber: FC<TranslatablePhoneNumber> = ({ children, variant = 'inline' }) => {
  const displayedText = Array.isArray(children) ? children[0] : ''
  const phone = displayedText.replace(/\D/g, '') // Strip out non-numeric characters
  const launchExternalLink = useExternalLink()

  if (variant === 'inline') {
    return (
      <TextView
        mb={-2.75}
        variant="HelperText"
        color="link"
        textDecoration="underline"
        textDecorationColor="link"
        onPress={() => {
          launchExternalLink(`tel:${phone}`)
        }}>
        {displayedText}
      </TextView>
    )
  } else if (variant === 'standalone') {
    return <ClickToCallPhoneNumber phone={phone} displayedText={displayedText} ttyBypass={true} />
  } else {
    return <ClickToCallPhoneNumber phone={phone} displayedText={displayedText} />
  }
}

export default TranslatablePhoneNumber
