import * as React from 'react'
import _ from 'underscore'

const getParams = (t: string) => {
  let b = t.split('\n')
  return b.map((item, index) => {
    let n = item.split('-')
    return (
      <div key={index}>
        <code>{n[0].trim() + ':'}</code>
        {'\ufeff' + n[1]}
      </div>
    )
  })
}

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
                  <td>{key === 'param' ? getParams(props[key]) : props[key]}</td>
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
