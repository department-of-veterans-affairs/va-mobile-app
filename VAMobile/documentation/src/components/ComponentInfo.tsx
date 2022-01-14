import React from 'react'
import CodeBlock from '@theme/CodeBlock'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

import { useGlobalDataForComponent } from '@site/utils/common'
import { PropTable } from './PropTable'

export default function ComponentInfo(props) {
  const globaldata = useGlobalDataForComponent(props.componentName)

  const { description, displayName, props: ComponentProps } = globaldata[0]
  const howToUseString = `How to use the ${displayName} component`
  const fullCodeString = `Full code for the ${displayName} component`

  return (
    <>
      {description}
      <br />
      <br />
      <Tabs>
        <TabItem value="props" label="Properties">
          <PropTable props={ComponentProps} />
        </TabItem>
        <TabItem value="example" label="Example">
          {props.example && (
            <CodeBlock title={howToUseString} className="language-tsx test">
              {props.example}
            </CodeBlock>
          )}
        </TabItem>
        <TabItem value="code" label="Source Code">
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
