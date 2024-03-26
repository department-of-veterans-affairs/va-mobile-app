#!/bin/bash

navigationName="$NAV_TESTS_TO_RUN"
#navigationName=("Appeals" "Claims")
operatingSystem="$OPERATING_SYSTEM"
#operatingSystem=ios

for i in ${navigationName[@]}; do
   yarn e2e:$operatingSystem-test /e2e/tests/Navigation.e2e $i -t=navigation
done
