---
title: Release process
---

<iframe width="800" height="650" title="Flagship mobile technical release process" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FuDs0x8clV8Df6P4Ldkh2Li%2FRelease-Process%3Fnode-id%3D0%253A1%26t%3D0A6XbacxiCx1k67E-1" allowfullscreen></iframe>

```mermaid
---
config:
  theme: redux
  layout: fixed
---
flowchart TD
    A["Release branch &amp; RC build is created from develop<br><b>(new_release_branch.yml)</b>"] --> B["Release approval issue is created<br><b>(release_branch_issue.yml)</b>"] & n1["Runs 2am ET, every Wednesday<br>(Script exits if not a release week<br><b>release_branch.sh</b>"]
    B --> n2@{ label: "When Github actions detects a branch named<br>'release/*' is pushed" } & n3["Time passes as QA tests the release canidate from Step 1"]
    n3 --> C["Approval is sent to release approvers<br><b>(approve_command.yml)</b>"]
    n4@{ label: "<div style=\"color:\"><span style=\"color:\">Approvers will get an email at the time of the workflow run. Once the task is approved, it will wait for 7 days (10,080 minutes). Once this time passes, the workflows will continue.</span></div>" } --> n5@{ label: "<div style=\"color:\"><span style=\"color:\">If necessary, the timer can be bypassed by navigating to the approval screen and clicking bypass. Only Admins of the repo can do this.</span></div>" }
    C --> n4 & n6["Release branch is merged into main<br><b>(release_pull_request.yml)</b>"]
    n6 --> n7["Tag release build vx.x.x<br>(<b>release_build.yml)</b>"] & n10["Tagged release builds are submitted to stores for review<br><b>(release_build.yml)</b>"]
    n7 --> n8["PR is opened to merge the release branch back into develop<br>(<b>release_pull_request.yml)</b>"]
    n8 --> n9["Actions triggered by approval <b>(approve_command.yml)</b>"]
    n10 --> n11@{ label: "<div style=\"color:\"><span style=\"color:\">Workflow runs when a tagged vx.x.x release is detected</span></div>" } & n12["Waiting on store approvals"]
    n12 --> n13["No action"] & n14["Approval email received"]
    n14 --> n15["No action"] & n16["Fastlane releases approved builds to the app stores (go_live.yml) from main"]
    n16 --> n17@{ label: "<div style=\"color:\"><span style=\"color:\">Time-based action triggered from go_live.yml<br>(Runs every Tuesday, 10am, ET)</span></div>" }
    A@{ shape: rounded}
    B@{ shape: rounded}
    n2@{ shape: rect}
    n3@{ shape: rounded}
    C@{ shape: rounded}
    n4@{ shape: rect}
    n5@{ shape: rect}
    n6@{ shape: rounded}
    n7@{ shape: rounded}
    n10@{ shape: rounded}
    n8@{ shape: rounded}
    n9@{ shape: rect}
    n11@{ shape: rect}
    n12@{ shape: rounded}
    n13@{ shape: rect}
    n14@{ shape: rounded}
    n15@{ shape: rect}
    n16@{ shape: rounded}
    n17@{ shape: rect}
     n3:::Ash
     n5:::Rose
    classDef Ash stroke-width:1px, stroke-dasharray:none, stroke:#999999, fill:#EEEEEE, color:#000000
    classDef Rose stroke-width:1px, stroke-dasharray:none, stroke:#FF5978, fill:#FFDFE5, color:#8E2236

```
