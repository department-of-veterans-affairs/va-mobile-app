import requests
import re
import os
import time
import sys
from datetime import datetime


ConfidenceThreshold = 1
thisJob = int(os.getenv('CIRCLE_BUILD_NUM'))
regexTest = os.getenv('BUILD_REGEX')

print(f"CIRCLE_BUILD_NUM: {thisJob}")
print(f"BUILD_REGEX: {regexTest}")

confidence = 0
runningTime = 0
sleepTime = 11
maxTime = 3600 #1 hour in seconds

print(f"Queueing all jobs that match regex {regexTest}")

while True:
  print("Fetching all running jobs for va-mobile-app")
  response = requests.get(
    'https://circleci.com/api/v1.1/project/github/department-of-veterans-affairs/va-mobile-app',
    params={'limit': 30, 'shallow': True, 'filter': 'running'},
    headers={'circle-token': os.getenv('CIRCLECI_TOKEN')}
  )
  #print(response)

#   get array of running jobs
  jobs = response.json()
  print(f"there are currently {len(jobs)} running")

#   keep only the jobs that match {regexTest}
  print(f"Filtering jobs to match {regexTest}")
  result = list(filter(lambda it: re.search(regexTest, it['workflows']['job_name']) != None, jobs))
  print(f"there are currently {len(result)} jobs that match regex {regexTest}")

  print("fetching all start times for jobs")
  for r in result:
    resp = requests.get(
      f"https://circleci.com/api/v2/workflow/{r['workflows']['workflow_id']}",
      headers={'circle-token':os.getenv('CIRCLECI_TOKEN')}
    )
    r['created_at'] = datetime.strptime(resp.json()['created_at'], '%Y-%m-%dT%H:%M:%SZ')

#   sort all the running jobs by datetime
  result = list(sorted(result, key=lambda it: it['created_at']))

#   fins the oldest running job
  oldestJob = result[0]['build_num']
#   check to see if oldest job is our job
  if oldestJob == thisJob:
#     if the oldest job is out job, gauge our confidence level.regexTest
#     Since the API can sometimes not have all running jobs, we make sure we reach a certain threshold before we let our build go
    if confidence < ConfidenceThreshold:
      confidence += 1
      print("No previous workflows, but below confidence threshold.")
      print("Rerun check in case there are queued jobs that we haven't picked up yet in the API")
    else:
      print("Job at front of the queue, releasing container to continue")
      break
  else:
#     not at the front of the line. reset confidence and pause before rerunning
    confidence = 0
    print(f"This build ({thisJob}) is queued, waiting for {oldestJob} fo finish")
    print(f"totalCurrent wait time is {runningTime} seconds" )
#   check running time to see if max allowed exceeded
  if runningTime >= maxTime:
    print("Exceeded maximum wait time, canceling build")
    rs = requests.post(
      'https://slack.com/api/chat.postMessage',
      headers={"Authorization": f"Bearer {os.getenv('SLACK_API_TOKEN')}", "Content-Type":"application/json"},
      json={"channel":"va-mobile-app-automation-test-channel",
        "text": f"A CircleCi build job exceeded queue time. <{os.getenv('CIRCLE_BUILD_URL')}|Please see CircleCI to see what is blocking the queue>",
        "icon_emoji": ":sad_robot:",
        "username": "Build Queue Robot"
      }
    )
    print(rs.json())
    cancelResp = requests.post(
      f"https://circleci.com/api/v1.1/project/github/department-of-veterans-affairs/va-mobile-app/{str(thisJob)}/cancel",
      headers={'circle-token':os.getenv('CIRCLECI_TOKEN')}
    )
#     sleep to make sure api cancels job before exiting
    time.sleep(10)
#     send slack message about queue error
    sys.exit("canceled build")

#   still have time left to wait. sleep the loop and update wait time
  time.sleep(sleepTime)
  runningTime += sleepTime
