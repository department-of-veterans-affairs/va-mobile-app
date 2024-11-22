#bin/bash

sitemap_path="VAMobile/documentation/build/sitemap.xml"

# Counter for the number of accessibility issues detected
num_issues=0

# Extract URLs from sitemap and iterate
issues=$(axe "https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/FrontEnd/DevSetupProcess" grep -oP '^\d+(?= Accessibility issues detected )
echo $issues
if [[ ! -z "$issues" ]]
then
  echo "$issues number of issues"
else
  echo "no issues"
fi
