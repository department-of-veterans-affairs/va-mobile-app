---
title: Release process
---

```mermaid
flowchart LR
    subgraph ReleaseProcess
        direction TB
        subgraph Step1
            direction LR
            A("Release branch & RC build is created from <i>develop</i><br><b>(new_release_branch.yml)</b>") --> B("Runs 2am ET, every Wednesday<br>(Script exits if not a release week) <br><b>release_branch.sh</b>")
        end
        subgraph Step2
            direction LR
            C("Release approval issue is created<br><b>(release_branch_issue.yml)</b>") --> D("When Github actions detects a branch named<br><i>release/*</i> is pushed")
        end
        subgraph Step3
            direction LR
            F("Approval is sent to release approvers<br><b>(release_branch_issue.yml)</b>") --> G("Approvers will get an email at the time of the workflow run. Once the task is approved, it will wait for 6 days (8,640 minutes). After this time passes, the workflows will continue.") --> S("If necessary, the timer can be bypassed by navigating to the approval screen and clicking bypass. Only Admins of the repo can do this.")
        end
        subgraph Step4
            direction LR
            E("Time passes as QA tests the release canidate from Step 1"):::gray
        end
        subgraph Step5
            direction LR
            U("After approval is granted and the timer expires, <br><i><b>/approve <release-version> <br>Approved By: <approver> <br></i></b>will be appended to the ticket.<br><b>(release_branch_issue.yml)</b>")
        end
        subgraph Step6
            direction LR
            H("Release branch is merged into <i>main</i><br><b>(release_pull_request.yml)</b>") --> I("Tag release build <i>v\*\.\*\.\*</i><br><b>(release_build.yml)</b>") --> T("PR is opened to merge the release branch back to <i>develop</i><br><b>(release_pull_request.yml)</b>") --> J("Actions triggered by approval<br><b>(approve_command.yml)</b>")
        end
        subgraph Step7
            direction LR
            K("Tagged release builds are submitted to stores for review<br><b>(release_build.yml)</b>") --> L("Workflow runs when a tagged <i>v\*\.\*\.\*</i> release is detected")
        end
        subgraph Step8
            direction LR
            M("Waiting on store approvals") --> N("No action")
        end
        subgraph Step9
            direction LR
            O("Approval e-mail received") --> P("No action")
        end
        subgraph Step10
            direction LR
            Q("Fastlane releases approved builds to the app stores <b>(go_live.yml)</b> from <i>main</i>.") --> R("Time-based action triggered from <b>go_live.yml</b> (runs every Tuesday, 10am ET)")
        end
    end

%%Color Classes%%
classDef blue fill:#ADD8E6,stroke:#333,stroke-width:2px;
classDef gray fill:#DCDCDC,stroke:#333,stroke-width:2px;
classDef white fill:#FFFFFF,stroke:#000000,stroke-width:2px;
classDef Rose stroke-width:1px, stroke-dasharray:none, stroke:#FF5978, fill:#FFDFE5, color:#8E2236
Step1:::white --> Step2:::white --> Step3:::white --> Step4:::white --> Step5:::white --> Step6:::white --> Step7:::white --> Step8:::white --> Step9:::white --> Step10:::white
A:::blue
B:::gray
C:::blue
D:::gray
E:::gray
F:::blue
G:::gray
H:::blue
I:::blue
J:::gray
K:::blue
L:::gray
M:::blue
N:::gray
O:::blue
P:::gray
Q:::blue
R:::gray
S:::Rose
T:::blue
U:::blue
ReleaseProcess:::white
```

<!-- <iframe width="800" height="650" title="Flagship mobile technical release process" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FuDs0x8clV8Df6P4Ldkh2Li%2FRelease-Process%3Fnode-id%3D0%253A1%26t%3D0A6XbacxiCx1k67E-1" allowfullscreen></iframe> -->
