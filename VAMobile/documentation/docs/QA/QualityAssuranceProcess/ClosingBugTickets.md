# Closing bug tickets

## Why not just write up all bugs and keep those issues around forever?
To deliver a meaningful, high-quality app to veterans, teams must devote some portion of their time to fixing bugs to improve the user experience. However, even on teams that are dedicating a reasonable portion of time towards those improvements, it's easy for a backlog of bug tickets to get bloated to the point where it's unmanageable (requires too much cognitive load to understand & prioritize).

In addition to spending 30% of our time on maintenance (bug fixes, code upkeep, and the like), a clear set of definitions for bug tickets that we will close as 'not fixing' will help keep the backlog of bug tickets to a manageable, meaningful set.

### When to close as not fixing
Bug tickets that should be closed without fixing include:
- Any bug in an external system, where the mobile app team cannot / will not be responsible for fixing it
    - For high-severity bugs, ideally when closing they will include information about how the issue was communicated to the responsible external team
- Bugs that are no longer relevant/no longer apply (for example, a visual issue with the UI of a screen, but the screen has since been redesigned to remove the previously-wrong element)
- Bugs that are prohibitively 'expensive'/risky to fix (decision made in conjunction with the relevant FE team)
- Low-severity bugs which have been reported from production, and we are unable to reproduce in staging

### Process
- Anyone can close a bug ticket as "not fixing" by closing the issue, adding a comment with explanation, and applying the "Closed - Can't / Won't Fix" label.
- Anyone can open a previously "not fixing" bug ticket by re-opening it, adding a comment with explanation, and contacting the owning subteam about it.