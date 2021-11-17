import React from 'react'

export default function IconsPathSection({ folder = undefined }) {
  return (
    <>
      These icons are located under <code>{`VaMobile/src/components/VAIcon/svgs${folder ? '/' + folder : ''}`}</code>
    </>
  )
}
