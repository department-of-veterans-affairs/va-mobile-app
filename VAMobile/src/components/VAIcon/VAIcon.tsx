import React, { FC, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { NumberProp, SvgProps } from 'react-native-svg'
import { useSelector } from 'react-redux'

import { Box, BoxProps } from 'components'
import FlagIconSvgs from 'components/VAIcon/flags'
// See VAIcon function documentation below for guidance on adding new SVGs
import Add from 'components/VAIcon/svgs/Add.svg'
import Building from 'components/VAIcon/svgs/Building.svg'
import CheckMark from 'components/VAIcon/svgs/CheckMark.svg'
import CircleCheckMark from 'components/VAIcon/svgs/CircleCheckMark.svg'
import Compose from 'components/VAIcon/svgs/Compose.svg'
import ExclamationTriangle from 'components/VAIcon/svgs/ExclamationTriangle.svg'
import ExternalLink from 'components/VAIcon/svgs/ExternalLink.svg'
import Folder from 'components/VAIcon/svgs/Folder.svg'
import Inbox from 'components/VAIcon/svgs/Inbox.svg'
import Info from 'components/VAIcon/svgs/Info.svg'
import Lock from 'components/VAIcon/svgs/Lock.svg'
import Minus from 'components/VAIcon/svgs/Minus.svg'
import PaperClip from 'components/VAIcon/svgs/PaperClip.svg'
import Phone from 'components/VAIcon/svgs/Phone.svg'
import QuestionMark from 'components/VAIcon/svgs/QuestionMark.svg'
import Redo from 'components/VAIcon/svgs/Redo.svg'
import Remove from 'components/VAIcon/svgs/Remove.svg'
import Reply from 'components/VAIcon/svgs/Reply.svg'
import Trash from 'components/VAIcon/svgs/Trash.svg'
import Unread from 'components/VAIcon/svgs/Unread.svg'
import UploadPhoto from 'components/VAIcon/svgs/UploadPhoto.svg'
import VASeal from 'components/VAIcon/svgs/VASeal.svg'
import VideoCamera from 'components/VAIcon/svgs/VideoCamera.svg'
// VASelector
import CheckBoxEmpty from 'components/VAIcon/svgs/checkbox/CheckBoxEmpty.svg'
import CheckBoxError from 'components/VAIcon/svgs/checkbox/CheckBoxError.svg'
import CheckBoxFilled from 'components/VAIcon/svgs/checkbox/CheckBoxFilled.svg'
import CheckBoxIntermediate from 'components/VAIcon/svgs/checkbox/CheckBoxIntermediate.svg'
// Links
import Calendar from 'components/VAIcon/svgs/links/Calendar.svg'
import Chat from 'components/VAIcon/svgs/links/Chat.svg'
import CircleExternalLink from 'components/VAIcon/svgs/links/CircleExternalLink.svg'
import CirclePhone from 'components/VAIcon/svgs/links/CirclePhone.svg'
import Directions from 'components/VAIcon/svgs/links/Directions.svg'
import PhoneTTY from 'components/VAIcon/svgs/links/PhoneTTY.svg'
import Text from 'components/VAIcon/svgs/links/Text.svg'
import RightArrowInCircle from 'components/VAIcon/svgs/links/right-arrow-blue-circle.svg'
// Navigation
import RadioEmpty from 'components/VAIcon/svgs/radio/RadioEmpty.svg'
import RadioFilled from 'components/VAIcon/svgs/radio/RadioFilled.svg'
import { RootState } from 'store'
import { AccessibilityState } from 'store/slices'
import { VAIconColors, VATextColors } from 'styles/theme'
import { updateFontScale } from 'utils/accessibility'
import { useAppDispatch, useFontScale, useTheme } from 'utils/hooks'

export const VA_ICON_MAP = {
  Add,
  Building,
  Calendar,
  Chat,
  CheckBoxEmpty,
  CheckBoxError,
  CheckBoxFilled,
  CheckBoxIntermediate,
  CheckMark,
  CircleCheckMark,
  CircleExternalLink,
  CirclePhone,
  Compose,
  Directions,
  ExclamationTriangle,
  ExternalLink,
  Folder,
  Inbox,
  Info,
  Lock,
  Minus,
  PaperClip,
  Phone,
  PhoneTTY,
  QuestionMark,
  RadioEmpty, // Also used for RadioDisabled content--same icon, different colors
  RadioFilled,
  Redo,
  Remove,
  Reply,
  RightArrowInCircle, // TODO: Ticket 3402 (or separate implementation ticket) to remove this icon
  Text,
  Trash,
  Unread,
  UploadPhoto,
  VASeal,
  VideoCamera,
  ...FlagIconSvgs,
}

export type VAIcons = keyof typeof VA_ICON_MAP

/**
 *  Props that need to be passed in to {@link VAIcon}
 */
export type VAIconProps = BoxProps & {
  /**  enum name of the icon to use {@link VA_ICON_MAP} **/
  name: VAIcons

  /** Fill color for the icon */
  fill?: keyof VAIconColors | keyof VATextColors | string

  /** Secondary fill color for duotone icons--fills icons inside main fill, defaults white */
  fill2?: keyof VAIconColors | keyof VATextColors | string

  /** Stroke color of the icon */
  stroke?: keyof VAIconColors | string

  /**  optional number use to set the width; otherwise defaults to svg's width */
  width?: NumberProp

  /**  optional number use to set the height; otherwise defaults to svg's height */
  height?: NumberProp

  /** optional maximum width when scaled (requires width and height props) */
  maxWidth?: number

  /** if true, prevents icon from being scaled (requires width and height props) */
  preventScaling?: boolean

  /** Optional TestID */
  testID?: string
}

/**
 * A common component to display assets (SVGs).
 *
 * For all icons in the SVG definitions, on the primary/only path:
 *    - Set `fill` to `#000` to inherit VAIcon's fill color prop
 * If the SVG icon is duotone, additionally:
 *    - Set `color` to `#fff` on the top level svg (not path)
 *    - Set `fill` to `currentColor` on the secondary path to inherit VAIcon's fill2 color prop
 * If the SVG icon uses stroke, additionally:
 *    - Set `stroke` to `#00F` to inherit VAIcon's stroke color prop
 *
 * Example icons of each classification:
 *    - One layer: HomeSelected.svg
 *    - Duotone: CircleCheckMark.svg
 *    - Stroke: RadioEmpty.svg
 *
 * @returns VAIcon component
 */
const VAIcon: FC<VAIconProps> = ({
  name,
  width,
  height,
  fill,
  fill2,
  stroke,
  maxWidth,
  preventScaling,
  testID,
  ...boxProps
}) => {
  const theme = useTheme()
  const fs: (val: number) => number = useFontScale()
  const dispatch = useAppDispatch()
  const { fontScale } = useSelector<RootState, AccessibilityState>((state) => state.accessibility)
  let iconProps = Object.create({ name, width, height, stroke, preventScaling, fill })

  useEffect(() => {
    // Listener for the current app state, updates the font scale when app state is active and the font scale has changed
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): void =>
      updateFontScale(newState, fontScale, dispatch),
    )
    return (): void => sub?.remove()
  }, [dispatch, fontScale])

  if (fill) {
    iconProps = Object.assign({}, iconProps, {
      fill: theme.colors.icon[fill as keyof VAIconColors] || theme.colors.text[fill as keyof VATextColors] || fill,
    })
  }

  if (fill2) {
    iconProps = Object.assign({}, iconProps, {
      color: theme.colors.icon[fill2 as keyof VAIconColors] || theme.colors.text[fill2 as keyof VATextColors] || fill2,
    })
  }

  if (stroke) {
    iconProps = Object.assign({}, iconProps, { stroke: theme.colors.icon[stroke as keyof VAIconColors] || stroke })
  }

  const Icon: FC<SvgProps> | undefined = VA_ICON_MAP[name]
  if (!Icon) {
    return <></>
  }

  if (width && height && typeof width === 'number' && typeof height === 'number') {
    if (preventScaling) {
      iconProps = { ...iconProps, width, height }
    } else if (maxWidth && fs(width) > maxWidth) {
      iconProps = { ...iconProps, width: maxWidth, height: (maxWidth / width) * height }
    } else {
      iconProps = { ...iconProps, width: fs(width), height: fs(height) }
    }
  }

  return (
    <Box testID={testID} {...boxProps}>
      <Icon preserveAspectRatio="xMinYMin slice" {...iconProps} />
    </Box>
  )
}

export default VAIcon
