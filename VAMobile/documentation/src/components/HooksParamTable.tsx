import * as React from 'react'
import _ from 'underscore'

export const HooksParamTable = ({ props }) => {
  if (!props) {
    return null
  }

  return (
    <>
      {!_.isEmpty(props) ? (
        <table>
          <thead>
            <tr>
              <th>Param / Return</th>
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
                  <td>{props[key]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <pre className={'preText'}>This component does not have param defined</pre>
      )}
    </>
  )
}
