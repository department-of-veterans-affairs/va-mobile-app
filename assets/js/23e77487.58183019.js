"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1281],{38909:function(e,t,n){n.d(t,{Z:function(){return m}});var i=n(67294),o=n(19055),r=n(26396),l=n(58215),c=n(82224),s=n(36005),a=function(e){var t=e.props;return t?i.createElement(i.Fragment,null,s.ZP.isEmpty(t)?i.createElement("pre",{className:"preText"},"This component does not have props defined"):i.createElement("table",null,i.createElement("thead",null,i.createElement("tr",null,i.createElement("th",null,"Name"),i.createElement("th",null,"Type"),i.createElement("th",null,"Default Value"),i.createElement("th",null,"Required"),i.createElement("th",null,"Description"))),i.createElement("tbody",null,Object.keys(t).map((function(e){var n;return i.createElement("tr",{key:e},i.createElement("td",null,i.createElement("code",null,e)),i.createElement("td",{style:{minWidth:200}},null==(n=t[e].type)?void 0:n.name),i.createElement("td",null,t[e].defaultValue&&t[e].defaultValue.value.toString()),i.createElement("td",null,t[e].required?"Yes":"No"),i.createElement("td",null,t[e].description))}))))):null};function m(e){var t=(0,c.N)(e.componentName)[0],n=t.description,s=t.displayName,m=t.props,p="How to use the "+s+" component",u="Full code for the "+s+" component";return i.createElement(i.Fragment,null,n,i.createElement("br",null),i.createElement("br",null),i.createElement(r.Z,null,i.createElement(l.Z,{value:"props",label:"Properties"},i.createElement(a,{props:m})),i.createElement(l.Z,{value:"example",label:"Example"},e.example&&i.createElement(o.Z,{title:p,className:"language-tsx test"},e.example)),i.createElement(l.Z,{value:"code",label:"Source Code"},e.codeString&&i.createElement(o.Z,{title:u,className:"language-tsx"},e.codeString)),i.createElement(l.Z,{value:"accessibility",label:"Accessibility"},i.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},82224:function(e,t,n){n.d(t,{N:function(){return o}});var i=n(28084),o=function(e){return(0,i.default)()["docusaurus-plugin-react-docgen-typescript"].default.filter((function(t){return t.displayName===e}))}},75815:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return a},default:function(){return f},exampleString:function(){return u},frontMatter:function(){return s},metadata:function(){return m},toc:function(){return p}});var i=n(87462),o=n(63366),r=(n(67294),n(3905)),l=(n(19055),n(38909)),c=["components"],s={},a=void 0,m={unversionedId:"UX/ComponentsSection/Selection and Input/Pickers/PickerList",id:"UX/ComponentsSection/Selection and Input/Pickers/PickerList",title:"PickerList",description:"",source:"@site/docs/UX/ComponentsSection/Selection and Input/Pickers/PickerList.mdx",sourceDirName:"UX/ComponentsSection/Selection and Input/Pickers",slug:"/UX/ComponentsSection/Selection and Input/Pickers/PickerList",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Pickers/PickerList",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Pickers",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Pickers/"},next:{title:"VADatePicker",permalink:"/va-mobile-app/docs/UX/ComponentsSection/Selection and Input/Pickers/VADatePicker"}},p=[],u="<PickerList items={pickerListItems} />",d={toc:p,exampleString:u};function f(e){var t=e.components,n=(0,o.Z)(e,c);return(0,r.kt)("wrapper",(0,i.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)(l.Z,{componentName:"PickerList",example:u,codeString:"import { useTranslation } from 'react-i18next'\nimport React, { FC } from 'react'\n\nimport { ButtonDecoratorType, List, ListItemObj, VAIconProps } from 'components'\nimport { NAMESPACE } from 'constants/namespaces'\nimport { TextLine } from 'components/types'\nimport { TextLineWithIconProps } from 'components/TextLineWithIcon'\nimport { TextLines } from 'components/TextLines'\n\n/**\n * Signifies each item in the list of items in {@link PickerListProps}\n */\nexport type PickerListItemObj = {\n  /** lines of text to display */\n  text: string\n  /** whether this item is the selected value **/\n  isSelected: boolean\n  /** icon to show */\n  icon?: VAIconProps\n} & Partial<ListItemObj>\n\n/**\n * Props for {@link PickerList}\n */\nexport type PickerListProps = {\n  /** list of items of which a button will be rendered per item */\n  items: Array<PickerListItemObj>\n  /** optional title to use for the list */\n  title?: string\n  /**optional a11y hint for the title */\n  titleA11yLabel?: string\n}\n\n/**\n * Display a list of buttons with text and optional actions\n */\nconst PickerList: FC<PickerListProps> = ({ items, title, titleA11yLabel }) => {\n  const { t } = useTranslation(NAMESPACE.COMMON)\n\n  const listItemObjs: Array<ListItemObj> = items.map((item: PickerListItemObj, index) => {\n    // Move all of the properties except text lines to the standard list item object\n    const { text, icon, testId, isSelected, ...listItemObj } = item\n\n    const textLine = icon ? [{ text, iconProps: icon, color: icon.fill } as TextLineWithIconProps] : [{ text } as TextLine]\n    const content = <TextLines listOfText={textLine} />\n\n    const backgroundColor = isSelected ? 'pickerSelectedItem' : 'list'\n    const decorator = isSelected ? ButtonDecoratorType.SelectedItem : ButtonDecoratorType.None\n\n    const defaultTestId = text ? text : t('picker.noSelection')\n    const testIdToUse = testId ? testId : defaultTestId\n\n    const a11yValue = t('listPosition', { position: index + 1, total: items.length })\n    const a11yState = {\n      selected: isSelected,\n    }\n\n    return { ...listItemObj, content, backgroundColor, decorator, testId: testIdToUse, a11yValue, a11yRole: 'menuitem', a11yState }\n  })\n\n  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />\n}\n\nexport default PickerList\n",mdxType:"ComponentTopInfo"}))}f.isMDXComponent=!0}}]);