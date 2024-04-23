# Naming Conventions

This page documents naming conventions as they pertain to the design system. It is not fully inclusive.

### Component Prop Naming

This section details the naming conventions of properties (props) passed into the components package to give a high level vernacular of how we think about the aspects of a component. Naming practices are more art than science due to the variety of functionality of the components so these are not necessarily hard and fast rules so much as guidelines.

General prop guidelines:
- Use `lowerCamelCase` capitalization
- Generic behavioral differentiation:
  - `variant` is the primary generic behavioral differentiator, accounting for the most meaningful functional distinction
  - `type` is the secondary generic behavioral differentiator, if needed
  - `modifier` is the tertiary generic behavioral differentiator, if the component includes enough generic variety
  - `alternative` is the quaternary generic behavioral differentiator, if somehow that level of generic naming is necessary
- `tone` is a special generic differentiator used for purely basic styling (e.g. Link color); delineated from `style` to keep distinct from React Native's default styling prop
- If the behavioral differentiation is simple, has generally accepted terminology, and/or is targeted to controlling a specific aspect, then consider functional prop naming over generic naming
  - For example: `expandable` for Alert that has expand/collapse behavior instead of secondary generic term (where `variant` controls Alert types of info/success/warning/error)
- `a11y` should be used for relevant accessibility related props, either as a prefix or descriptor (`A11y`) if multiple props have accessibility modifiers
