# API Version Migration Guide

This guide outlines the steps and best practices for migrating from the V0 to the V1 API in the VA Mobile App codebase.

## Goals

1. Migrate an API endpoint from a old version (`v0`), to a new version (`v1`)
2. Ensure backwards compatibility between functionality and types
3. Minimize changes to client code
4. Support a feature toggle-able rollout plan using versions and users as determining factors

## General Idea

### Setup

- Use a waygate toggle to control version number
- Use a authService to control whether or not the user has flipper access
- Create Union types to help minimize type changes in code
- Aim to have smallest client side code change footprint, but don't sacrifice standards and good code to not change things.

## Roll out

- Use test flight and flipper to control testing

## Clean up

- Enable Waygate for all version past X version number
- Toggle at 100%
- In a PR
  - Remove toggle from Auth Service and default to on in the code
  - Remove waygate and default to on
- In follow up PR
  - remove old types and references to the deprecated API
