# Claims status tool walk through
## Status Page Nuts and Bolts
Here are some of the important parts of the CST on the front end that map from the API data. This should convert to some constants and probably helper functions in the mobile app.

### Each Claim has a phase - `claim.attributes.phase`:
```javascript
PHASE_TO_STATUS = {
      1 => ‘Claim received’,
      2 => ‘Initial review’,
      3 => EVIDENCE_GATHERING,
      4 => EVIDENCE_GATHERING,
      5 => EVIDENCE_GATHERING,
      6 => EVIDENCE_GATHERING,
      7 => ‘Preparation for notification’,
      8 => ‘Complete’
    }
```
These are then serialized to a `userPhase` for simplification of logic in the view:
```javascript
export function getUserPhase(phase) {
  if (phase < 3) {
    return phase;
  } else if (phase >= 3 && phase < 7) {
    return 3;
  }
  
  return phase - 3;
}
```


### Claims have events in `claim.attributes.event_timeline`:
```typescript
{
  "tracked_item_id": ,
  "file_type": "VA 21-526EZ, Fully Developed Claim (Compensation)",
  "document_type": "L533",
  "filename": "Gregory_Wheeler_526.pdf",
  "upload_date": "2017-11-01",
  "type": "other_documents_list",
  "date": "2017-11-01",
},
```

### Uses this helper to filter for things a Veteran needs to send in (`filesNeeded`): 
```javascript
export function itemsNeedingAttentionFromVet(events) {
  return events.filter(
    event =>
      event.status === 'NEEDED' && event.type === 'still_need_from_you_list',
  ).length;
}
```

### Only show the docs needed from you area if the following:
```javascript
!claim.attributes.decisionLetterSent &&
claim.attributes.open &&
claim.attributes.documentsNeeded &&
filesNeeded > 0;
```

### Claim is closed if the following: 
```javascript
claim.attributes.decisionLetterSent && !claim.attributes.open

```

### Claim is complete(which really means step 4) if the following:
```javascript
!claim.attributes.decisionLetterSent && !claim.attributes.open

```


## Claim Timeline
This section will deal with the logic inside the ClaimTimeline class [here](https://github.com/department-of-veterans-affairs/vets-website/blob/fcf944bd4319684f5eb3d1901606801d01a9a55e/src/applications/claims-status/components/ClaimsTimeline.jsx)

Content for each step is also in this file. 

### Claim timeline is broken into 5 `ClaimPhase` components in an ordered list:
```jsx
<ClaimPhase
  phase={1}
  current={userPhase}
  activity={activityByPhase}
  id={id}
/>
```

### `event.type` has enumerated values: 
```javascript
{
	'phase_entered',
	'filed',
	'completed',
	'still_need_from_you_list',
	'still_need_from_others_list',
	'received_from_you_list',
	'received_from_others_list',
	'never_received_from_you_list',
	'never_received_from_others_list',
 	'other_documents_list'
}
```

### Component then sorts events by phase with this helper: 
```javascript
export function groupTimelineActivity(events) {
  const phases = {};
  let activity = [];
  const phaseEvents = events
    .map(event => {
      if (event.type.startsWith(‘phase’)) {
        return {
          type: ‘phase_entered’,
          phase: getPhaseNumber(event.type) + 1,
          date: event.date,
        };
      }
      return event;
    })
    .filter(isEventOrPrimaryPhase);
  phaseEvents.forEach(event => {
    if (event.type.startsWith(‘phase’)) {
      activity.push(event);
      phases[getUserPhase(event.phase)] = activity;
      activity = [];
    } else {
      activity.push(event);
    }
  });
  if (activity.length > 0) {
    phases[1] = activity;
  }
  return phases;
}
```

### Component then takes the events specified for that phase and uses those to show activity in that phase. 

This may not matter for mobile, we may just need this for evidence phase component

### Document types have a code associated with a label:
```javascript
export const DOC_TYPES = [
  { value: 'L029', label: 'Copy of a DD214' },
  { value: 'L450', label: 'STR - Dental - Photocopy' },
  { value: 'L451', label: 'STR - Medical - Photocopy' },
  { value: 'L049', label: 'Medical Treatment Record - Non-Government Facility', },
  { value: 'L034', label: 'Military Personnel Record' },
  { value: 'L107', label: 'VA Form 21-4142 - Authorization To Disclose Information', },
  { value: 'L827', label: 'VA Form 21-4142a - General Release for Medical Provider Information', },
  { value: 'L229', label: 'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault', },
  { value: 'L228', label: 'VA Form 21-0781 - Statement in Support of Claim for PTSD', },
  { value: 'L149', label: 'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability', },
  { value: 'L115', label: 'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability', },
  { value: 'L159', label: 'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant', },
  { value: 'L117', label: 'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904', },
  { value: 'L139', label: 'VA Form 21-686c - Declaration of Status of Dependents', },
  { value: 'L133', label: 'VA Form 21-674 - Request for Approval of School Attendance', },
  { value: 'L102', label: 'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance', },
  { value: 'L222', label: 'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance', },
  { value: 'L702', label: 'Disability Benefits Questionnaire (DBQ)' },
  { value: 'L703', label: 'Goldmann Perimetry Chart/Field Of Vision Chart' },
  { value: 'L070', label: 'Photographs' },
  { value: 'L023', label: 'Other Correspondence' },
];

```


### Because we compress phase 4, 5, and 6 we have to check and make sure the ‘phase_entered’ actually means something: 
```javascript
function isEventOrPrimaryPhase(event) {
  if (event.type === 'phase_entered') {
    return event.phase <= 3 || event.phase >= 7;
  }
  
  return !!getItemDate(event);
}
```


### Estimated date is the `claim.attribures.max_est_date` 

### Data for the active claim - issues screen is in `claim.attributes`: 
```javascript
"claim_type": "Compensation",
"contention_list": [
"abscess liver (New)"
],
"va_representative": "VENKATA KOMMOJU", 
```

### There is a component to tell the VA that you want them to work your claim with the evidence that you have submitted and forgo the rest of development:
```javascript
const FIRST_GATHERING_EVIDENCE_PHASE = 3;
...
const showDecision =
  claim.attributes.phase === FIRST_GATHERING_EVIDENCE_PHASE &&
  !claim.attributes.waiverSubmitted;
{showDecision && <AskVAToDecide id={this.props.params.id} />}
```

On Submit it runs this action: 
```javascript
export function submitRequest(id) {
  return dispatch => {
    dispatch({
      type: SUBMIT_DECISION_REQUEST,
    });
    makeAuthRequest(
      `/v0/evss_claims/${id}/request_decision`,
      { method: 'POST' },
      dispatch,
      () => {
        dispatch({ type: SET_DECISION_REQUESTED });
        dispatch(
          setNotification({
            title: 'Request received',
            body:
              'Thank you. We have your claim request and will make a decision.',
          }),
        );
      },
      error => {
        dispatch({ type: SET_DECISION_REQUEST_ERROR, error });
      },
    );
  };
}

```