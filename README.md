# Basic serverless render cache demo: AWS Lambda and DynamoDB

Use Lambda to fetch HTML from sites and cache it in DynamoDB for faster renders.

Beware that there is a size limit to how much data/HTML you can fit into a DynamoDB field.

Note that this should not be used as-is in a production setting. Please ensure that you do string sanitization and other security work on any incoming data, and don't be as lax as I am with the permissions in `serverless.yml`.

## Prerequisites

- You have an AWS account
- You are logged in through your environment
- You have sufficient permissions to deploy the resources

## Installation

Run `npm install` or `yarn install`.

## Deploy

Run `sls deploy`.

## Offline development

Run `sls offline`. Call your local endpoint like `http://localhost:3000/dev/render?url=https://www.google.com`.

## Calling the deployed function

Call your endpoint (you will see the URL at the end of the deployment sequence) and add a query string for a URL to retrieve, cache and send back. An example could be `https://thcpaovbdl.execute-api.eu-north-1.amazonaws.com/dev/render?url=https://www.google.com`.

## Remove stack

Run `sls remove`.
