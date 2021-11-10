import React from 'react'
import useGlobalData from '@docusaurus/useGlobalData'
import CodeBlock from '@theme/CodeBlock'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import { PropTable } from './PropTable'

export const getGlobalDataForComponent = (componentName) => {
  const globalData = useGlobalData()
  const myPluginData = globalData['docusaurus-plugin-react-docgen-typescript']['default']
  return myPluginData.filter((component) => component.displayName === componentName)
}

export default function ComponentInfo(props) {
  const globaldata = getGlobalDataForComponent(props.componentName)
  const { description, displayName, props: ComponentProps } = globaldata[0]
  const howToUseString = `How to use the ${displayName} component`
  const fullCodeString = `Full code for the ${displayName} component`

  return (
    <>
      <Tabs>
        <TabItem value="description" label="Description">
          <pre className={'preText'}>{description}</pre>
        </TabItem>
        <TabItem value="props" label="Props">
          <PropTable props={ComponentProps} />
        </TabItem>
        <TabItem value="example" label="Example">
          {props.example && (
            <CodeBlock title={howToUseString} className="language-tsx test">
              {props.example}
            </CodeBlock>
          )}
        </TabItem>
        <TabItem value="code" label="Full Code Source">
          {props.codeString && (
            <CodeBlock title={fullCodeString} className="language-tsx">
              {props.codeString}
            </CodeBlock>
          )}
        </TabItem>
        <TabItem value="accessibility" label="Accessibility">
          {<pre className={'preText'}>{props.accessibilityInfo}</pre>}
        </TabItem>
      </Tabs>
    </>
  )
}
