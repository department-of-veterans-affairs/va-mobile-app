---
title: Specs
---

## Overview

The majority of testing done before deploying code changes is through Rspec tests. These can be found in vets-api at `/modules/mobile/specs`.

## Debugging Flaky Specs

Specs will sometimes pass/fail inconsistently due to the complicated testing environment.

To reproduce and debug these type of issues, follow these steps:

1. Push code branch into a draft PR if it is not already in PR.
2. Go to the code check action that failed and download the `Test Results` in the artifacts section.
3. There may be multiple xml files, find the one that has the failure.
4. Run `ruby modules/mobile/lib/scripts/parse_rspec_xml.rb <PATH TO XML>` (this will recreate the exact testing order that caused the failure)
5. Run the command that the script outputs, running the specs to reproduce the error.
