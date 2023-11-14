# Get started with development...

_This could be a tough one if you are new to the technologies used below, reading some docs would not hurt..._

> There is a `backend.drawio` and `frontend.drawio` diagram that almost represents what's in the code, use the relevant VSC plugin to view it.

## Configure AWS _to deploy your dev version_

_Once you configured your AWS credentials, SST will take care of the rest during the first start._

- Create an AWS account [here](https://sst.dev/chapters/create-an-aws-account.html)
- Configure AWS credentials [here](https://sst.dev/chapters/configure-the-aws-cli.html)

## Create a Slack workspace and app _to test on your own_

- Create a new slack workspace if you don't have one [here](https://slack.com/get-started#/createnew)
- Create a new slack app [here](https://api.slack.com/apps?new_app=1)
  - Name it like: `Apex Homework - {your name}`,
  - create in your workspace
- In "OAuth & Permissions", add the following bot token scopes:
  - `channels:read, chat:write, im:write, users:read, channels:manage`
- Then "Install to Workspace" and set the token in SST:
  - `npx sst secrets set SLACK_BOT_TOKEN "__YOUR_TOKEN__"`
- From "Basic Information" menu, get the signing secret and set in SST:
  - `npx sst secrets set SLACK_SIGNING_SECRET "__YOUR_TOKEN__"`
- Create a Slack channel in your workspace, join it and get "Channel ID" and set in SST:
  - `npx sst secrets set SLACK_CHANNEL_ID "__YOUR_TOKEN__"`
- Invite your app's bot to your channel as described [here](https://www.ibm.com/docs/en/z-chatops/1.1.0?topic=slack-adding-your-bot-user-your-channel)

## Set up an ngrok tunnel _to test on your mobile_

_Ngrok is used to forward traffic from the web to your frontend that runs on your local machine. This way, you can open up the ngrok url that you got in your mobile, so you can test the application with ease._

- Register an ngrok account and get an auth token: https://ngrok.com/
- Set the NGROK_AUTH_TOKEN env variable in the .env file to the auth token you got from ngrok.

## Install dependencies

- Run `pnpm i -r` to install dependencies.

## Actually run the application

- S3 buckets has to be named unique globally, so you would like to change that from `beconnected-bucket` before deploying, or it will fail to deploy. :)

- Run `pnpm frontend:start` in one terminal to start the frontend.
- Run `pnpm ngrok:start` in another terminal to start ngrok. In the background this will replace the `siteUrl` variable in the stack, so you can easily open the links sent by your local environment outside of your local network (eg. your phone, sending it to your PO :))
- Run `pnpm sst:start:wait-on-ngrok` in another terminal to start the backend. This will only start if ngrok is running.

## Production deploy to separate AWS org

_This part is only necessary if you decided to build the production deploy pipeline from the DevOps tasks._

It is a good practise to use a separate AWS org for your prod deployment, but with SST it will not work as easy as you'd expect, once you try to deploy your app to a secondary org, (like PROD), you'll get an error message like this:

> Resource handler returned message: “Access denied for operation ‘AWS::CloudFront::Distribution: Your account must be verified before you can add new CloudFront resources. To verify your account, please contact AWS Support

You have to send the full message to the AWS support (generic support, account related question) and ask them to fix this for you, it ususaly takes 1-2 days. :)
