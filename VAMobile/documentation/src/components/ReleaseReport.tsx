import React from 'react'

import data from '@site/static/data/github-milestones.json'

const MilestoneIssues = () => {
  return (
    <div>
      {data.map((milestone, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <h2>{milestone.title}</h2>
          <p>Released on: {new Date(milestone.due_on).toLocaleDateString()}</p>
          <ul>
            {milestone.issues.map((issue) => (
              <li key={issue.number}>
                <a href={issue.url}>
                  #{issue.number} {issue.title} {issue.isPR ? '(PR)' : '(Issue)'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default MilestoneIssues
