import React from 'react'
import data from '@site/static/data/workflows.json'

const WorkflowsList = () => {
  return (
    <div>
      {data.map((workflow, index) => (
        <div key={index} style={{ marginBottom: '3rem', borderBottom: '1px solid #ddd', paddingBottom: '2rem' }}>
          <h2>{workflow.name}</h2>
          <p style={{ fontStyle: 'italic', color: '#666' }}>File: <code>.github/workflows/{workflow.fileName}</code></p>
          
          {workflow.description && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Description:</strong>
              <p>{workflow.description}</p>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <strong>Triggers:</strong>
            <ul style={{ marginTop: '0.5rem' }}>
              {Object.keys(workflow.on).map((trigger) => (
                <li key={trigger}>
                  <code>{trigger}</code>
                  {typeof workflow.on[trigger] === 'object' && workflow.on[trigger] !== null && (
                    <ul style={{ fontSize: '0.9em', color: '#555' }}>
                      {Object.keys(workflow.on[trigger]).map((detail) => (
                        <li key={detail}>
                          {detail}: {JSON.stringify(workflow.on[trigger][detail])}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Jobs:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {workflow.jobs.map((job) => (
                <span key={job} style={{ 
                  backgroundColor: '#f0f0f0', 
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  fontSize: '0.85em',
                  border: '1px solid #ccc'
                }}>
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WorkflowsList
