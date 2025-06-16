const axios = require('axios');
const dayjs = require('dayjs');

async function main() {
  const PAGERDUTY_API_TOKEN = process.env.PAGERDUTY_API_TOKEN;
  const PAGERDUTY_SCHEDULE_ID = process.env.PAGERDUTY_SCHEDULE_ID;
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

  if (!PAGERDUTY_API_TOKEN || !PAGERDUTY_SCHEDULE_ID || !SLACK_BOT_TOKEN || !SLACK_CHANNEL_ID) {
    throw new Error('Missing required environment variables.');
  }

  const start = dayjs().startOf('day').toISOString();
  const end = dayjs().endOf('day').toISOString();

  console.log(`Getting on-call user for schedule ${PAGERDUTY_SCHEDULE_ID} between ${start} and ${end}...`);

  // Fetch the on-call user for today
  const response = await axios.get(
    `https://api.pagerduty.com/schedules/${PAGERDUTY_SCHEDULE_ID}/users`,
    {
      headers: {
        Authorization: `Token token=${PAGERDUTY_API_TOKEN}`,
        Accept: 'application/vnd.pagerduty+json;version=2',
      },
      params: {
        since: start,
        until: end,
      },
    }
  );

  if (!response.data.users || response.data.users.length === 0) {
    throw new Error('No on-call user found in the schedule.');
  }

  const user = response.data.users[0];
  const onCallName = user.summary;

  const topic = `This week's on-call: ${onCallName}`;

  console.log(`Updating Slack channel topic to: "${topic}"`);

  // Update Slack channel topic
  const slackResponse = await axios.post(
    'https://slack.com/api/conversations.setTopic',
    new URLSearchParams({
      channel: SLACK_CHANNEL_ID,
      topic,
    }),
    {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!slackResponse.data.ok) {
    throw new Error(`Failed to update Slack topic: ${slackResponse.data.error}`);
  }

  console.log('Slack topic updated successfully.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
