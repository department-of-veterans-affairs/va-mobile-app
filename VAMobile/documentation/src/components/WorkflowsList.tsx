import React from 'react'
import data from '@site/static/data/workflows.json'
import cronstrue from 'cronstrue'

/**
 * Base URL for linking directly to the workflow file on GitHub.
 */
const GITHUB_WORKFLOW_BASE_URL = 'https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/'

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
  workflow_call: 'Called by other workflows (workflow_call)',
  workflow_dispatch: 'Manual Trigger (workflow_dispatch)',
  workflow_run: 'Triggered by other workflows (workflow_run)',
}

// --- Utilities ---

/**
 * Converts snake_case or kebab-case strings to Title Case with spaces.
 * e.g., "ready_for_review" -> "Ready For Review"
 */
const toTitleCase = (str: string) => 
  str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')

/**
 * Generates a URL-friendly slug from a workflow name by stripping brackets
 * and replacing spaces with dashes.
 */
const getSlug = (name: string) => 
  name.toLowerCase().replace(/\[|\]/g, '').replace(/\s+/g, '-').replace(/[^\w-]/g, '')

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
 * GitHub allows 'on' to be a string, an array, or an object.
 * This function ensures we always have an object for consistent iteration.
 */
const normalizeTriggers = (workflowOn: any) => {
  if (typeof workflowOn === 'string') return { [workflowOn]: {} }
  if (Array.isArray(workflowOn)) return workflowOn.reduce((acc, trigger) => ({ ...acc, [trigger]: {} }), {})
  return workflowOn || {}
}

/**
 * Aggregates all possible inputs from different triggers (e.g., workflow_dispatch and workflow_call)
 * into a single object for rendering the Inputs table.
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
 * Groups workflows by their bracketed prefix (e.g., [Admin], [Build]).
 */
const TableOfContents = ({ groupedData }: { groupedData: Record<string, typeof data> }) => {
  const sortedPrefixes = Object.keys(groupedData).sort()
  
  return (
    <div className="margin-bottom--xl p--md" style={{ background: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {sortedPrefixes.map(prefix => (
          <div key={prefix}>
            <h4 className="margin-bottom--sm" style={{ textTransform: 'capitalize' }}>{prefix}</h4>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, fontSize: '0.9rem' }}>
              {groupedData[prefix].map(workflow => (
                <li key={workflow.fileName} className="margin-bottom--xs">
                  <a href={`#${getSlug(workflow.name)}`}>
                    {/* Prefix is stripped from the display name to reduce noise */}
                    {workflow.name.replace(/^\[.*?\]/, '').trim()}
                  </a>
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
 * Renders specific configuration details for a trigger, such as cron schedules,
 * file paths, or action types (Opened, Synchronize, etc.).
 */
const TriggerDetails = ({ trigger, triggerConfig }: { trigger: string, triggerConfig: any }) => {
  if (typeof triggerConfig !== 'object' || triggerConfig === null) return null

  const isSchedule = trigger === 'schedule'
  
  return (
    <ul className="text--small">
      {isSchedule ? (
        // Render human-readable cron summaries
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
          {/* Render generic key-value details, filtering out structural keys handled elsewhere */}
          {Object.keys(triggerConfig)
            .filter((key) => !['branches', 'tags', 'inputs', 'types', 'paths', 'workflows', 'secrets', 'outputs'].includes(key))
            .map((detail) => (
              <li key={detail}>
                {detail}: {JSON.stringify(triggerConfig[detail])}
              </li>
            ))}
          
          {/* Render event types (e.g., opened, reopened) in title case.
              Normalize to array since YAML allows `types: closed` (string) or `types: [closed, opened]` (array). */}
          {triggerConfig.types && (
            (Array.isArray(triggerConfig.types) ? triggerConfig.types : [triggerConfig.types]).map((type: string) => (
              <li key={type}>{toTitleCase(type)}</li>
            ))
          )}
          
          {/* Render file path filters if present.
              Normalize to array since YAML allows `paths: 'VAMobile/**'` (string) or `paths: [...]` (array). */}
          {triggerConfig.paths && (() => {
            const paths = Array.isArray(triggerConfig.paths) ? triggerConfig.paths : [triggerConfig.paths]
            return (
              <li key="paths">
                File Paths:
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                  {paths.map((path: string) => (
                    <li key={path}><code>{path}</code></li>
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
 * Renders a single top-level trigger entry (e.g., Push, Pull Request)
 * along with its branch, tag, or workflow dependencies.
 */
const WorkflowTrigger = ({ trigger, triggerConfig }: { trigger: string, triggerConfig: any }) => {
  const baseName = friendlyTriggerNames[trigger] || trigger
  let displayName: React.ReactNode = baseName

  if (triggerConfig && typeof triggerConfig === 'object') {
    // Extract common filters
    const branches = triggerConfig.branches ? (Array.isArray(triggerConfig.branches) ? triggerConfig.branches : [triggerConfig.branches]) : []
    const tags = triggerConfig.tags ? (Array.isArray(triggerConfig.tags) ? triggerConfig.tags : [triggerConfig.tags]) : []
    const workflows = triggerConfig.workflows ? (Array.isArray(triggerConfig.workflows) ? triggerConfig.workflows : [triggerConfig.workflows]) : []

    // Append filter summaries to the main trigger name for scannability
    if (branches.length > 0 || tags.length > 0 || workflows.length > 0) {
      displayName = (
        <>
          {baseName}
          {branches.length > 0 && (
            <>
              {' '}to {branches.map((branch: string, i: number) => (
                <React.Fragment key={branch}>
                  <code>{branch}</code>{i < branches.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))} {branches.length === 1 ? 'branch' : 'branches'}
            </>
          )}
          {branches.length > 0 && tags.length > 0 && ' or'}
          {tags.length > 0 && (
            <>
              {' '}tags matching {tags.map((tag: string, i: number) => {
                const example = getTagExample(tag)
                return (
                  <React.Fragment key={tag}>
                    <code>{tag}</code>{example ? ` (e.g. ${example})` : ''}{i < tags.length - 1 ? ', ' : ''}
                  </React.Fragment>
                )
              })}
            </>
          )}
          {workflows.length > 0 && (
            <>
              {' '}{workflows.map((wf: string, i: number) => (
                <React.Fragment key={wf}>
                  <code>{wf}</code>{i < workflows.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))}
            </>
          )}
        </>
      )
    }
  }

  return (
    <li key={trigger}>
      {displayName}
      <TriggerDetails trigger={trigger} triggerConfig={triggerConfig} />
    </li>
  )
}

/**
 * Renders a responsive table detailed the parameters/inputs required by the workflow.
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
              const defaultDisplay = defaultValue !== undefined ? <code>{defaultValue === '' ? '""' : String(defaultValue)}</code> : '-'
              
              return(
              <tr key={inputName}>
                <td><code>{inputName}</code></td>
                <td>{description || '-'}</td>
                <td><code>{type || 'string'}</code></td>
                <td>{defaultDisplay}</td>
                <td>{required ? 'Yes' : 'No'}</td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Main Component ---

/**
 * Main component that renders the list of GitHub Actions Workflows.
 * It provides a Table of Contents and detailed sections for each workflow
 * including triggers, file paths, and input tables.
 */
const WorkflowsList = () => {
  // Group workflows by prefix [Admin], [Build], etc. for the TOC
  const groupedData = data.reduce((acc, workflow) => {
    const match = workflow.name.match(/^\[(.*?)\]/)
    const prefix = match ? match[1] : 'Other'
    if (!acc[prefix]) acc[prefix] = []
    acc[prefix].push(workflow)
    return acc
  }, {} as Record<string, typeof data>)

  return (
    <div>
      {/* 1. Quick Navigation Grid */}
      <TableOfContents groupedData={groupedData} />
      
      <hr />

      {/* 2. Detailed Workflow Sections */}
      {data.map((workflow, index) => {
        const slug = getSlug(workflow.name)
        const on = normalizeTriggers(workflow.on)
        const allInputs = extractAllInputs(on)

        return (
          <div key={index} id={slug} className="margin-top--xl margin-bottom--xl">
            <h2>{workflow.name}</h2>
            
            {/* Metadata: File link and Description */}
            <p className="margin-bottom--md">
              <strong>File:</strong> <a href={`${GITHUB_WORKFLOW_BASE_URL}${workflow.fileName}`} target="_blank" rel="noopener noreferrer">
                {workflow.fileName}
              </a>
            </p>
            
            {workflow.description && (
              <div className="margin-bottom--md">
                <strong>Description:</strong>
                <p>{workflow.description}</p>
              </div>
            )}

            {/* Event Triggers List */}
            <div className="margin-bottom--md">
              <strong>Triggers:</strong>
              <ul className="margin-top--sm">
                {Object.keys(on).map((trigger) => (
                  <WorkflowTrigger key={trigger} trigger={trigger} triggerConfig={on[trigger]} />
                ))}
              </ul>
            </div>

            {/* Input parameters table (if applicable) */}
            <InputsTable inputs={allInputs} />
            
            <hr className="margin-top--xl" />
          </div>
        )
      })}
    </div>
  )
}

export default WorkflowsList
