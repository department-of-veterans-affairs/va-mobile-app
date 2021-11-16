"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7411],{6040:function(e,o,n){n.r(o),n.d(o,{contentTitle:function(){return a},default:function(){return g},exampleString:function(){return v},frontMatter:function(){return m},metadata:function(){return l},toc:function(){return p}});var t=n(7462),r=n(3366),s=(n(7294),n(3905)),i=(n(9055),n(8909)),c=["components"],m={},a=void 0,l={unversionedId:"FrontEnd/ComponentsSection/VAIcon",id:"FrontEnd/ComponentsSection/VAIcon",isDocsHomePage:!1,title:"VAIcon",description:"// set icon color using theme",source:"@site/docs/FrontEnd/ComponentsSection/VAIcon.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/VAIcon",permalink:"/docs/FrontEnd/ComponentsSection/VAIcon",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"VADatePicker",permalink:"/docs/FrontEnd/ComponentsSection/VADatePicker"},next:{title:"VAImage",permalink:"/docs/FrontEnd/ComponentsSection/VAImage"}},p=[],v="<VAIcon name={'Logo'} />\n<VAIcon name={'ArrowUp'} fill={theme.colors.icon.inactive}/> // set icon color using theme\n ",d={toc:p,exampleString:v};function g(e){var o=e.components,n=(0,r.Z)(e,c);return(0,s.kt)("wrapper",(0,t.Z)({},d,n,{components:o,mdxType:"MDXLayout"}),(0,s.kt)(i.Z,{componentName:"VAIcon",example:v,codeString:"import { AppState, AppStateStatus } from 'react-native'\nimport { SvgProps } from 'react-native-svg'\nimport { isFinite } from 'underscore'\nimport React, { FC, useEffect } from 'react'\n\nimport { VAIconColors } from 'styles/theme'\nimport { useFontScale, useTheme } from 'utils/hooks'\n\nimport { Box, BoxProps } from 'components'\n// New svgs need to set `fill` to `#000` and `stroke` to `#00F`. See /svgs for examples\n// Navigation\nimport ClaimsSelected from './svgs/navIcon/claimsSelected.svg'\nimport ClaimsUnselected from './svgs/navIcon/claimsUnselected.svg'\nimport HealthSelected from './svgs/navIcon/healthSelected.svg'\nimport HealthUnselected from './svgs/navIcon/healthUnselected.svg'\nimport HomeSelected from './svgs/navIcon/homeSelected.svg'\nimport HomeUnselected from './svgs/navIcon/homeUnselected.svg'\nimport ProfileSelected from './svgs/navIcon/profileSelected.svg'\nimport ProfileUnselected from './svgs/navIcon/profileUnselected.svg'\n\n// Arrows\nimport ArrowDown from './svgs/chevron-down.svg'\nimport ArrowLeft from './svgs/chevron-left.svg'\nimport ArrowRight from './svgs/chevron-right.svg'\nimport ArrowUp from './svgs/chevron-up.svg'\n\n// forces icons\n\nimport Airforce from './svgs/dodBranch/air-force.svg'\nimport Army from './svgs/dodBranch/army.svg'\nimport CoastGuard from './svgs/dodBranch/coast-guard.svg'\nimport Marines from './svgs/dodBranch/marine.svg'\nimport Navy from './svgs/dodBranch/navy.svg'\n\n// Links\nimport Calendar from './svgs/links/calendar.svg'\nimport Chat from './svgs/links/chat.svg'\nimport Directions from './svgs/links/directions.svg'\nimport Phone from './svgs/links/phone.svg'\nimport PhoneTTY from './svgs/links/phone-tty.svg'\nimport RightArrowInCircle from './svgs/links/right-arrow-blue-circle.svg'\nimport Text from './svgs/links/text.svg'\n\n// Webview\nimport WebviewBack from './svgs/webview/chevron-left-solid.svg'\nimport WebviewForward from './svgs/webview/chevron-right-solid.svg'\nimport WebviewOpen from './svgs/webview/external-link-alt-solid.svg'\nimport WebviewRefresh from './svgs/webview/redo-solid.svg'\n\n// VASelector\nimport DisabledRadio from './svgs/radio/radioDisabled.svg'\nimport EmptyCheckBox from './svgs/checkbox/checkBoxEmpty.svg'\nimport EmptyRadio from './svgs/radio/radioEmpty.svg'\nimport ErrorCheckBox from './svgs/checkbox/checkBoxError.svg'\nimport FilledCheckBox from './svgs/checkbox/checkBoxFilled.svg'\nimport FilledRadio from './svgs/radio/radioFilled.svg'\n\n// Misc\nimport { AccessibilityState, StoreState } from 'store/reducers'\nimport { updateFontScale } from 'utils/accessibility'\nimport { useDispatch, useSelector } from 'react-redux'\nimport Bullet from './svgs/bullet.svg'\nimport CheckMark from './svgs/check-mark.svg'\nimport CircleCheckMark from './svgs/checkmark-in-circle.svg'\nimport Compose from './svgs/compose.svg'\nimport DatePickerArrows from './svgs/date-picker-arrows.svg'\nimport Lock from './svgs/webview/lock-solid.svg'\nimport Logo from './svgs/vaParentLogo/logo.svg'\nimport PaperClip from './svgs/paperClip.svg'\nimport PhoneSolid from './svgs/phoneSolid.svg'\nimport QuestionMark from './svgs/questionMark.svg'\nimport Remove from './svgs/remove.svg'\nimport Reply from './svgs/reply.svg'\nimport UnreadIcon from './svgs/unread_icon.svg'\nimport VideoCamera from './svgs/videoCamera.svg'\n\nexport const VA_ICON_MAP = {\n  HomeSelected,\n  HomeUnselected,\n  HealthSelected,\n  HealthUnselected,\n  ClaimsSelected,\n  ClaimsUnselected,\n  ProfileSelected,\n  ProfileUnselected,\n  ArrowDown,\n  ArrowUp,\n  ArrowLeft,\n  ArrowRight,\n  Airforce,\n  Army,\n  Bullet,\n  Calendar,\n  Compose,\n  CircleCheckMark,\n  CoastGuard,\n  Directions,\n  EmptyCheckBox,\n  FilledCheckBox,\n  EmptyRadio,\n  FilledRadio,\n  DisabledRadio,\n  Marines,\n  Navy,\n  PaperClip,\n  Phone,\n  PhoneTTY,\n  Chat,\n  Text,\n  RightArrowInCircle,\n  Reply,\n  WebviewBack,\n  WebviewForward,\n  WebviewOpen,\n  WebviewRefresh,\n  Lock,\n  DatePickerArrows,\n  CheckMark,\n  Logo,\n  ErrorCheckBox,\n  QuestionMark,\n  Remove,\n  UnreadIcon,\n  VideoCamera,\n  PhoneSolid,\n}\n/**\n *  Props that need to be passed in to {@link VAIcon}\n */\nexport type VAIconProps = BoxProps & {\n  /**  enum name of the icon to use {@link VA_ICON_MAP} **/\n  name: keyof typeof VA_ICON_MAP\n\n  /** Fill color for the icon */\n  fill?: keyof VAIconColors | string\n\n  /** Stroke color of the icon */\n  stroke?: keyof VAIconColors | string\n\n  /**  optional number use to set the width; otherwise defaults to svg's width */\n  width?: number\n\n  /**  optional number use to set the height; otherwise defaults to svg's height */\n  height?: number\n\n  /** optional boolean that prevents the icon from being scaled when set to true */\n  preventScaling?: boolean\n}\n\n/**\n * A common component to display assets(svgs). Svgs need to place in VAIcon/svgs folder. Set fill to #000 and stroke to #00F in the svg so VAIcon component can set the fill/stroke color. Examples/details can be found in VAIcon component.\n *\n * @returns VAIcon component\n */\nconst VAIcon: FC<VAIconProps> = (props: VAIconProps) => {\n  const theme = useTheme()\n  let domProps = Object.create(props)\n  const fs: (val: number) => number = useFontScale()\n  const dispatch = useDispatch()\n  const { fontScale } = useSelector<StoreState, AccessibilityState>((state) => state.accessibility)\n  const { name, width, height, fill, stroke, preventScaling } = props\n\n  useEffect(() => {\n    // Listener for the current app state, updates the font scale when app state is active and the font scale has changed\n    const sub = AppState.addEventListener('change', (newState: AppStateStatus): void => updateFontScale(newState, fontScale, dispatch))\n    return (): void => sub.remove()\n  }, [dispatch, fontScale])\n\n  if (fill) {\n    domProps = Object.assign({}, domProps, { fill: theme.colors.icon[fill as keyof VAIconColors] || fill })\n  }\n\n  if (stroke) {\n    domProps = Object.assign({}, domProps, { stroke: theme.colors.icon[stroke as keyof VAIconColors] || stroke })\n  }\n\n  const Icon: FC<SvgProps> | undefined = VA_ICON_MAP[name]\n  if (!Icon) {\n    return <></>\n  }\n  delete domProps.name\n\n  if (width && isFinite(width)) {\n    domProps = Object.assign({}, domProps, { width: preventScaling ? width : fs(width) })\n  }\n\n  if (height && isFinite(height)) {\n    domProps = Object.assign({}, domProps, { height: preventScaling ? height : fs(height) })\n  }\n\n  return (\n    <Box {...domProps}>\n      <Icon {...domProps} />\n    </Box>\n  )\n}\n\nexport default VAIcon\n",mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);