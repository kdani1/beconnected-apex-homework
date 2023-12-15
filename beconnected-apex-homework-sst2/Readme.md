# CHANGELOG:
Test
# Entree: Allow user to retake photo
Done, user can retake a photo on the review page by clicking on the retake button

# Main: complete photo upload functionality
Done, the image.ts uploads the image to the S3 bucket and gives a response

# Dessert: Dual camera photo:
Done, on the frontend we have both photos shown inside a montage in bereal style.
Single merged photo gets send to the backend
EXTRA: Download button to download the merged photo easily to your device
The photos can be swapped by clicking on the small photo
The photos are shown as separate elements, and can be dragged around for fun :D (Optimized for mobile devices)

# ADDITIONAL FRONTEND:
Added BeConnected text to Loading, Camera, Review, Success, and Failed pages.
Added Rocket Button on success page to go to slack page or app if in smartphone.
Added checking for initial camera permissions (because if the camera was not allowed initially, it wouldn't work without reload and after enabling camera it wouldn't reload automatically at least in chrome based broswers, now it does. 
//TESTED AND WORKED AS EXPECTED on win 10 (Chrome, Firefox, Edge) on Android 12, 13 (Chrome, Firefox, Edge, Brave) 
//DOES NOT WORKED VERY WELL with Safari (Same as originally) at least until you enable the camera permission in the settings, or reload a few times

## Entree: PO's manual testing request
Done, need to set up a new user group (not role) called PO and you need to put the PO in there and then on every starting of the backend it will display an api link in the console, and if the user group has been created and the PO is in the user group it will send the api url in a pm message on slack need to restart if the PO was't added to the user group

## Main: Handle uploaded images
Done, s3 upload event driven lambda function - services/lambdas/upload-to-slack.ts
Basic functionality: 
- invocation up on s3 upload events
- gets the uploaded image
- creates a new private channel every day if it doesn't exist already
- archives the previous days channels
- invites the user to the private channel who uploaded the image
- if the user is not already a member, then uploads the image
EXTRA: Also displays how long did the user wait to upload the image from the notification
Sends a message to the public channel to let everyone know when an image is uploaded

IMPORTANT: Additional Scopes: groups:write.invites, groups:read, groups:write,
PS: I know that it says use the available scopes only, but i just feel like that this makes it a lot more like bereal, because the images can only be seen by those who upload as well that day.

//TODO: Dont let anyone write in the private daily channel

#### Entree: Improve local development
Concurrent start:
- Run `pnpm install --save-dev concurrently` to install dependencies.
- Run `pnpm start:all` to start all from one console with one command


////////////////////////////////////////////////////////////////////////////////////////////////

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
