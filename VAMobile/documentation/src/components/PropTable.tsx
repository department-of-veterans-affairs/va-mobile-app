import * as React from 'react'
import _ from 'underscore'

export const PropTable = ({ props }) => {
  if (!props) {
    return null
  }

  return (
    <>
      {!_.isEmpty(props) ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default Value</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(props).map((key) => {
              return (
                <tr key={key}>
                  <td>
                    <code>{key}</code>
                  </td>
                  <td style={{ minWidth: 200 }}>{props[key].type?.name}</td>
                  <td>{props[key].defaultValue && props[key].defaultValue.value.toString()}</td>
                  <td>{props[key].required ? 'Yes' : 'No'}</td>
                  <td>{props[key].description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <pre className={'preText'}>This component does not have props defined</pre>
      )}
    </>
  )
}
