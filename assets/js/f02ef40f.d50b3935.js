"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6699],{38909:function(e,t,n){n.d(t,{Z:function(){return d}});var o=n(67294),r=n(19055),s=n(26396),i=n(58215),l=n(82224),a=n(36005),p=function(e){var t=e.props;return t?o.createElement(o.Fragment,null,a.ZP.isEmpty(t)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(t).map((function(e){var n;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),o.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),o.createElement("td",null,t[e].required?"Yes":"No"),o.createElement("td",null,t[e].description))}))))):null};function d(e){var t=(0,l.N)(e.componentName)[0],n=t.description,a=t.displayName,d=t.props,m="How to use the "+a+" component",c="Full code for the "+a+" component";return o.createElement(o.Fragment,null,n,o.createElement("br",null),o.createElement("br",null),o.createElement(s.Z,null,o.createElement(i.Z,{value:"props",label:"Properties"},o.createElement(p,{props:d})),o.createElement(i.Z,{value:"example",label:"Example"},e.example&&o.createElement(r.Z,{title:m,className:"language-tsx test"},e.example)),o.createElement(i.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(r.Z,{title:c,className:"language-tsx"},e.codeString)),o.createElement(i.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},30712:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return p},default:function(){return u},exampleString:function(){return c},frontMatter:function(){return a},metadata:function(){return d},toc:function(){return m}});var o=n(87462),r=n(63366),s=(n(67294),n(3905)),i=(n(19055),n(38909)),l=["components"],a={},p=void 0,d={unversionedId:"Engineering/FrontEnd/ComponentsSection/Box",id:"Engineering/FrontEnd/ComponentsSection/Box",title:"Box",description:"`",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/Box.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection",slug:"/Engineering/FrontEnd/ComponentsSection/Box",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Box",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"BaseListItem",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/BaseListItem"},next:{title:"ClickForActionLink",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/ClickForActionLink"}},m=[],c="<Box flexShrink={1}>\n    <TextView {...textViewProps}>{displayedText}</TextView>\n</Box>",h={toc:m,exampleString:c};function u(e){var t=e.components,n=(0,r.Z)(e,l);return(0,s.kt)("wrapper",(0,o.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)(i.Z,{componentName:"Box",example:c,codeString:"import { FlexAlignType, View, ViewProps } from 'react-native'\nimport { VABackgroundColors, VABorderColors, VAButtonBackgroundColors, VAButtonBorderColors, VATheme } from 'styles/theme'\nimport React, { FC, ReactNode } from 'react'\nimport _ from 'underscore'\nimport styled from 'styled-components'\n\nimport { themeFn } from 'utils/theme'\n\ntype VABackgroundColorsVariant = keyof VABackgroundColors\ntype VAButtonBackgroundColorsVariant = keyof VAButtonBackgroundColors\nexport type BackgroundVariant = VABackgroundColorsVariant | VAButtonBackgroundColorsVariant\n\ntype VABorderColorsVariant = keyof VABorderColors\ntype VAButtonBorderColorsVariant = keyof VAButtonBorderColors\nexport type BorderColorVariant = VABorderColorsVariant | VAButtonBackgroundColorsVariant\nexport type BorderStyles = 'none' | 'dotted' | 'solid' | 'dashed'\nexport type BorderWidths = 'default' | number\n\n// assume strings are coming back as `<number>px`\ntype NumOrStrPx = number | string\n\nexport type BoxProps = ViewProps & {\n  /** set margin of this component*/\n  m?: NumOrStrPx\n  /** set margin top of this component*/\n  mt?: NumOrStrPx\n  /** set margin right of this component*/\n  mr?: NumOrStrPx\n  /** set margin bottom of this component*/\n  mb?: NumOrStrPx\n  /** set margin left of this component*/\n  ml?: NumOrStrPx\n  /** set margin right and left of this component*/\n  mx?: NumOrStrPx | 'auto'\n  /** set margin top and bottom of this component*/\n  my?: NumOrStrPx\n  /** set padding of this component*/\n  p?: NumOrStrPx\n  /** set padding top of this component*/\n  pt?: NumOrStrPx\n  /** set padding right of this component*/\n  pr?: NumOrStrPx\n  /** set padding bottom of this component*/\n  pb?: NumOrStrPx\n  /** set padding left of this component*/\n  pl?: NumOrStrPx\n  /** set padding right and left of this component*/\n  px?: NumOrStrPx\n  /** set padding top and bottom of this component*/\n  py?: NumOrStrPx\n  /** sets the number of logical pixels to offset the top edge of this component*/\n  top?: string | number\n  /** sets the number of logical pixels to offset the left edge of this component*/\n  left?: string | number\n  /** sets the number of logical pixels to offset the right edge of this component*/\n  right?: string | number\n  /** sets the number of logical pixels to offset the bottom edge of this component*/\n  bottom?: string | number\n  /** sets the positioning to relative or absolute of this component*/\n  position?: 'relative' | 'absolute'\n  /**sets the display type of this component*/\n  display?: 'flex' | 'none'\n  /**sets the flex property of this component*/\n  flex?: number\n  /**describes how any space within a container should be distributed among its children along the main axis*/\n  flexGrow?: number\n  /**flexShrink describes how to shrink children along the main axis in the case in which the total size of the children overflows the size of the container on the main axis*/\n  flexShrink?: number\n  /**controls whether children can wrap around after they hit the end of a flex container*/\n  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'\n  /**controls which directions children of a container go*/\n  flexDirection?: 'column' | 'row'\n  /**controls how children are measured and displayed*/\n  overflow?: 'hidden' | 'visible' | 'scroll'\n  /**aligns children in the main direction*/\n  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'\n  /**aligns children in the cross direction*/\n  alignItems?: 'center' | 'flex-start' | 'flex-end'\n  /**controls how a child aligns in the cross direction, overriding the alignItems of the parent*/\n  alignSelf?: 'auto' | FlexAlignType\n  /** react nodes passed to the component*/\n  children?: ReactNode\n  /** sets the width of this component*/\n  width?: number | string\n  /** sets the min width of this component*/\n  minWidth?: number | string\n  /** sets the height of this component*/\n  height?: number | string\n  /** sets the min height of this component*/\n  minHeight?: number | string\n  /**alings the text of this component*/\n  textAlign?: 'center' | 'left' | 'right'\n  /** sets the background color of this component*/\n  backgroundColor?: BackgroundVariant\n  /** sets the opacity of this component*/\n  opacity?: number\n  /** sets the border width of this component*/\n  borderWidth?: BorderWidths\n  /** sets the border color of this component*/\n  borderColor?: BorderColorVariant\n  /** sets the border style of this component*/\n  borderStyle?: BorderStyles\n  /** sets the bottom border's width of this component*/\n  borderBottomWidth?: BorderWidths\n  /** sets the bottom border's color of this component*/\n  borderBottomColor?: BorderColorVariant\n  /** sets the top border's width of this component*/\n  borderTopWidth?: BorderWidths\n  /** sets the top border's color of this component*/\n  borderTopColor?: BorderColorVariant\n  /** sets the right border's width of this component*/\n  borderRightWidth?: BorderWidths\n  /** sets the right border's color of this component*/\n  borderRightColor?: BorderColorVariant\n  /** sets the left border's width of this component*/\n  borderLeftWidth?: BorderWidths\n  /** sets the left border's color of this component*/\n  borderLeftColor?: BorderColorVariant\n  /** sets the border's radius of this component*/\n  borderRadius?: number | string\n}\n\nconst toDimen = (val?: string | number): string | undefined => {\n  if (val === undefined || val === null) {\n    return\n  }\n  if (_.isFinite(val)) {\n    return `${val}px`\n  }\n  return `${val}`\n}\n\nconst generateBoxStyles = (\n  s: 'margin' | 'padding',\n  a?: NumOrStrPx,\n  t?: NumOrStrPx,\n  l?: NumOrStrPx,\n  r?: NumOrStrPx,\n  b?: NumOrStrPx,\n  x?: NumOrStrPx | 'auto',\n  y?: NumOrStrPx,\n): { [key: string]: string | undefined } => {\n  const styles: { [key: string]: string | undefined } = {}\n\n  styles[`${s}-top`] = toDimen(t)\n  styles[`${s}-right`] = toDimen(r)\n  styles[`${s}-bottom`] = toDimen(b)\n  styles[`${s}-left`] = toDimen(l)\n\n  if (a) {\n    styles[s] = toDimen(a)\n  }\n\n  if (x) {\n    const xDimen = toDimen(x)\n    if (xDimen === 'auto') {\n      styles[`${s}-left`] = 'auto'\n      styles[`${s}-right`] = 'auto'\n    } else {\n      styles[`${s}-left`] = xDimen\n      styles[`${s}-right`] = xDimen\n    }\n  }\n\n  if (y) {\n    styles[`${s}-top`] = toDimen(y)\n    styles[`${s}-bottom`] = toDimen(y)\n  }\n\n  return styles\n}\n\nconst getBackgroundColor = (theme: VATheme, bgVariant: BackgroundVariant | undefined): string => {\n  if (!bgVariant) {\n    return 'transparent'\n  }\n  return theme.colors.background[bgVariant as VABackgroundColorsVariant] || theme.colors.buttonBackground[bgVariant as VAButtonBackgroundColorsVariant]\n}\n\nconst generateBorderStyles = (\n  theme: VATheme,\n  direction: '' | 'top' | 'bottom' | 'left' | 'right',\n  width?: BorderWidths,\n  style?: BorderStyles,\n  color?: BorderColorVariant,\n): { [key: string]: string } => {\n  const styles: { [key: string]: string } = {}\n  const dir = direction !== '' ? `-${direction}` : ''\n\n  if (width) {\n    styles[`border${dir}-width`] = _.isFinite(width) ? `${width}px` : `${theme.dimensions.borderWidth}px`\n  }\n\n  if (style) {\n    styles['border-style'] = style\n  }\n\n  if (color) {\n    styles[`border${dir}-color`] = theme.colors.border[color as VABorderColorsVariant] || theme.colors.buttonBorder[color as VAButtonBorderColorsVariant]\n  }\n  return styles\n}\n\nexport const createBoxStyles = (theme: VATheme, props: BoxProps): string => {\n  const { m, mt, ml, mr, mb, mx, my } = props\n  const mStyles = generateBoxStyles('margin', m, mt, ml, mr, mb, mx, my)\n  const { p, pt, pl, pr, pb, px, py } = props\n  const pStyles = generateBoxStyles('padding', p, pt, pl, pr, pb, px, py)\n\n  const { borderWidth, borderStyle, borderColor } = props\n  const borderStyles = generateBorderStyles(theme, '', borderWidth, borderStyle, borderColor)\n  const { borderTopWidth, borderTopColor } = props\n  const btStyles = generateBorderStyles(theme, 'top', borderTopWidth, borderStyle, borderTopColor)\n  const { borderBottomWidth, borderBottomColor } = props\n  const bbStyles = generateBorderStyles(theme, 'bottom', borderBottomWidth, borderStyle, borderBottomColor)\n  const { borderLeftWidth, borderLeftColor } = props\n  const blStyles = generateBorderStyles(theme, 'left', borderLeftWidth, borderStyle, borderLeftColor)\n  const { borderRightWidth, borderRightColor } = props\n  const brStyles = generateBorderStyles(theme, 'right', borderRightWidth, borderStyle, borderRightColor)\n\n  const styles = {\n    position: props.position,\n    top: toDimen(props.top),\n    left: toDimen(props.left),\n    right: toDimen(props.right),\n    bottom: toDimen(props.bottom),\n    display: props.display,\n    'justify-content': props.justifyContent,\n    'align-items': props.alignItems,\n    'align-self': props.alignSelf,\n    width: typeof props.width === 'number' ? `${props.width}px` : props.width,\n    minWidth: typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth,\n    height: typeof props.height === 'number' ? `${props.height}px` : props.height,\n    minHeight: typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight,\n    flex: props.flex,\n    'flex-direction': props.flexDirection,\n    'flex-shrink': props.flexShrink,\n    'flex-grow': props.flexGrow,\n    'flex-wrap': props.flexWrap,\n    'text-align': props.textAlign,\n    overflow: props.overflow,\n    ...mStyles,\n    ...pStyles,\n    'background-color': getBackgroundColor(theme, props.backgroundColor),\n    opacity: props.opacity,\n    ...borderStyles,\n    ...btStyles,\n    ...bbStyles,\n    ...blStyles,\n    ...brStyles,\n    'border-radius': typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,\n  }\n\n  return _.map(styles, (v, k) => {\n    if (v === undefined) {\n      return undefined\n    }\n    return `${k}:${v}`\n  })\n    .filter((line) => line !== undefined)\n    .join(';\\n')\n}\n\nconst StyledBox = styled(View)`\n  ${themeFn<BoxProps>((theme, props) => createBoxStyles(theme, props))};\n`\n/**\n * A common component for layout. It conforms to the convention of [m] [my] [mx] [mt] [mb] [ml] [mr] for specifying margins. It also accepts dimensions for padding in the same form.\n *\n * @returns TextView component\n */\nconst Box: FC<BoxProps> = (props) => {\n  return <StyledBox {...props} />\n}\n\nexport default Box\n",mdxType:"ComponentTopInfo"}))}u.isMDXComponent=!0}}]);