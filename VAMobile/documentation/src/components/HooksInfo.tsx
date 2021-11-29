import React from 'react'
import CodeBlock from '@theme/CodeBlock'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

import { useGlobalDataForComponent } from '@site/utils/common'
import { HooksParamTable } from './HooksParamTable'

export default function HooksInfo(props) {
  const globaldata = useGlobalDataForComponent(props.componentName)
  const { description, displayName, tags } = globaldata[0]

  const howToUseString = `How to use the ${displayName} component`

  return (
    <>
      <Tabs>
        <TabItem value="description" label="Description">
          <pre className={'preText'}>{description}</pre>
        </TabItem>
        <TabItem value="params" label="Params and Return">
          <HooksParamTable props={tags} />
        </TabItem>
        <TabItem value="example" label="Example">
          {props.example && (
            <CodeBlock title={howToUseString} className="language-tsx test">
              {props.example}
            </CodeBlock>
          )}
        </TabItem>
      </Tabs>
    </>
  )
}
