import React from 'react'

import Link from '@docusaurus/Link'
import data from '@site/static/data/workflows.json'
import cronstrue from 'cronstrue'

/**
 * Base URL for linking directly to the workflow file on GitHub.
 */
const GITHUB_WORKFLOW_BASE_URL =
  'https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/'

/**
 * Mapping of raw GitHub Action trigger event names to human-friendly labels.
 */
const friendlyTriggerNames = {
  create: 'Branch or Tag Created',
  issues: 'Issue',
  pull_request_review: 'Pull Request Review',
  pull_request: 'Pull Request',
  push: 'Push',
  repository_dispatch: 'Called by other repos or external events (repository_dispatch)',
  schedule: 'Schedule',
  workflow_call: 'Used by other workflows (workflow_call):',
  workflow_dispatch: 'Manual Trigger (workflow_dispatch)',
  workflow_run: 'Triggered by other workflows (workflow_run)',
}

// --- Utilities ---

/**
 * Converts snake_case or kebab-case strings to Title Case with spaces.
 * e.g., "ready_for_review" -> "Ready For Review"
 */
const toTitleCase = (str: string) =>
  str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

/**
 * Generates a URL-friendly slug from a workflow name or object.
 */
const getSlug = (item: string | { name: string; fileName?: string }) => {
  const name = typeof item === 'string' ? item : item.name
  return name
    .toLowerCase()
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

/**
 * Provides representative human-readable examples for common glob-style tag patterns
 * used in the VA Mobile GitHub Actions (e.g., `v*.*.*`, `RC-v**`).
 */
const getTagExample = (pattern: string) => {
  if (pattern === 'v[0-9]+.[0-9]+.[0-9]+') return 'v1.22.0'
  if (pattern.startsWith('RC-v')) return 'RC-v1.22.0-20240101-01'
  return null
}

/**
 * Normalizes the 'on' property of a workflow.
 */
const normalizeTriggers = (workflowOn: any) => {
  if (typeof workflowOn === 'string') return { [workflowOn]: {} }
  if (Array.isArray(workflowOn)) return workflowOn.reduce((acc, trigger) => ({ ...acc, [trigger]: {} }), {})
  return workflowOn || {}
}

/**
 * Aggregates all possible inputs from different triggers.
 */
const extractAllInputs = (on: any) => {
  const allInputs = {}
  Object.keys(on).forEach((trigger) => {
    const triggerConfig = on[trigger]
    if (triggerConfig && triggerConfig.inputs) {
      Object.assign(allInputs, triggerConfig.inputs)
    }
  })
  return allInputs
}

// --- Sub-components ---

/**
 * Renders a grid-based Table of Contents at the top of the page.
 */
const TableOfContents = ({ groupedData }: { groupedData: Record<string, typeof data> }) => {
  const sortedPrefixes = Object.keys(groupedData).sort()

  return (
    <div
      className="margin-bottom--xl p--md"
      style={{ background: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {sortedPrefixes.map((prefix) => (
          <div key={prefix}>
            <h4 className="margin-bottom--sm" style={{ textTransform: 'capitalize' }}>
              {prefix}
            </h4>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, fontSize: '0.9rem' }}>
              {groupedData[prefix].map((workflow) => (
                <li key={workflow.fileName} className="margin-bottom--xs">
                  <Link to={`#${getSlug(workflow.name)}`}>{workflow.name.replace(/^\[.*?\]/, '').trim()}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Renders configuration details for a trigger (branches, tags, types, paths, cron).
 */
const TriggerDetails = ({ trigger, triggerConfig }: { trigger: string; triggerConfig: any }) => {
  if (!triggerConfig || typeof triggerConfig !== 'object') return null

  const isSchedule = trigger === 'schedule'

  return (
    <ul className="text--small" style={{ listStyleType: 'none', paddingLeft: '1rem', marginTop: '0.25rem' }}>
      {isSchedule ? (
        triggerConfig.map((schedule: any, idx: number) => {
          let humanReadable = ''
          try {
            humanReadable = cronstrue.toString(schedule.cron)
          } catch (e) {
            humanReadable = 'Invalid cron expression'
          }
          return (
            <li key={idx}>
              Cron: <code>{schedule.cron}</code> ({humanReadable} UTC)
            </li>
          )
        })
      ) : (
        <>
          {triggerConfig.branches && (
            <li key="branches">
              Branches:{' '}
              <code>
                {(Array.isArray(triggerConfig.branches) ? triggerConfig.branches : [triggerConfig.branches]).join(', ')}
              </code>
            </li>
          )}
          {triggerConfig.tags && (
            <li key="tags">
              Tags:{' '}
              <code>{(Array.isArray(triggerConfig.tags) ? triggerConfig.tags : [triggerConfig.tags]).join(', ')}</code>
            </li>
          )}
          {triggerConfig.types && (
            <li key="types">
              Types:{' '}
              <code>
                {(Array.isArray(triggerConfig.types) ? triggerConfig.types : [triggerConfig.types])
                  .map(toTitleCase)
                  .join(', ')}
              </code>
            </li>
          )}
          {triggerConfig.paths &&
            (() => {
              const paths = Array.isArray(triggerConfig.paths) ? triggerConfig.paths : [triggerConfig.paths]
              return (
                <li key="paths">
                  File Paths:
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                    {paths.map((path: string) => (
                      <li key={path}>
                        <code>{path}</code>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })()}
        </>
      )}
    </ul>
  )
}

/**
 * Renders a single top-level trigger entry and any dependencies (Used By).
 */
const WorkflowTrigger = ({
  trigger,
  triggerConfig,
  usedBy,
}: {
  trigger: string
  triggerConfig: any
  usedBy?: string[]
}) => {
  const baseName = friendlyTriggerNames[trigger] || trigger

  return (
    <li key={trigger} className="margin-bottom--sm">
      <strong>{baseName}</strong>
      <TriggerDetails trigger={trigger} triggerConfig={triggerConfig} />

      {/* Used By: displayed for reusable workflows */}
      {trigger === 'workflow_call' && usedBy && (
        <ul className="margin-top--xs" style={{ listStyleType: 'circle', paddingLeft: '1.5rem' }}>
          {usedBy.map((caller: string, i: number) => {
            const match = caller.match(/(.*) \((.*\.yml)\)/)
            if (match) {
              const [_, name, fileName] = match
              return (
                <li key={i}>
                  <Link to={`#${getSlug({ name, fileName })}`}>{name}</Link>
                </li>
              )
            }
            return <li key={i}>{caller}</li>
          })}
        </ul>
      )}
    </li>
  )
}

/**
 * Renders a responsive table detailing the parameters/inputs required by the workflow.
 */
const InputsTable = ({ inputs }: { inputs: any }) => {
  const entries = Object.entries(inputs)
  if (entries.length === 0) return null

  return (
    <div className="margin-bottom--md">
      <strong>Inputs:</strong>
      <div className="table-responsive margin-top--sm">
        <table>
          <thead>
            <tr>
              <th>Input</th>
              <th>Description</th>
              <th>Type</th>
              <th>Default</th>
              <th>Required</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([inputName, config]: [string, any]) => {
              const { description, type, default: defaultValue, required } = config
              const defaultDisplay =
                defaultValue !== undefined ? <code>{defaultValue === '' ? '""' : String(defaultValue)}</code> : '-'

              return (
                <tr key={inputName}>
                  <td>
                    <code>{inputName}</code>
                  </td>
                  <td>{description || '-'}</td>
                  <td>
                    <code>{type || 'string'}</code>
                  </td>
                  <td>{defaultDisplay}</td>
                  <td>{required ? 'Yes' : 'No'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Main Component ---

const WorkflowsList = () => {
  const groupedData = data.reduce(
    (acc, workflow) => {
      const match = workflow.name.match(/^\[(.*?)\]/)
      const prefix = match ? match[1] : 'Other'
      if (!acc[prefix]) acc[prefix] = []
      acc[prefix].push(workflow)
      return acc
    },
    {} as Record<string, typeof data>,
  )

  if (!data || data.length === 0) {
    return (
      <p>
        No workflow data available. Run <code>yarn prebuild</code> to generate it.
      </p>
    )
  }

  return (
    <div>
      <TableOfContents groupedData={groupedData} />
      <hr />

      {data.map((workflow) => {
        const slug = getSlug(workflow.name)
        const on = normalizeTriggers(workflow.on)
        const allInputs = extractAllInputs(on)

        return (
          <div key={workflow.fileName} id={slug} className="margin-top--xl margin-bottom--xl">
            <h2 className="margin-bottom--sm">{workflow.name}</h2>

            <p className="margin-bottom--md">
              <strong>File:</strong>{' '}
              <a href={`${GITHUB_WORKFLOW_BASE_URL}${workflow.fileName}`} target="_blank" rel="noopener noreferrer">
                {workflow.fileName}
              </a>
            </p>

            {workflow.description && (
              <div className="margin-bottom--md">
                <strong>Description:</strong>
                <p>{workflow.description}</p>
              </div>
            )}

            <div className="margin-bottom--md">
              <strong>Triggers:</strong>
              <ul className="margin-top--sm">
                {Object.keys(on).map((trigger) => (
                  <WorkflowTrigger
                    key={trigger}
                    trigger={trigger}
                    triggerConfig={on[trigger]}
                    usedBy={workflow.usedBy}
                  />
                ))}
              </ul>
            </div>

            <InputsTable inputs={allInputs} />
            <hr className="margin-top--xl" />
          </div>
        )
      })}
    </div>
  )
}

export default WorkflowsList
