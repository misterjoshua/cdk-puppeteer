# AWS CDK-based Puppeteer-in-Lambda Example

This repository demonstrates how to use the [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) to deploy a
Lambda function that uses [Puppeteer](https://pptr.dev) to render a screenshot of a website, save it to an S3 bucket,
and return the URL of the screenshot so you can view it.

## Usage

1. Clone this repository.
2. Run `yarn`
3. Load your AWS credentials so CDK can deploy the stack.
4. Run `yarn deploy`
5. Visit the URL output by the CDK stack to see a link to a screenshot
6. Run `yarn destroy` to remove the stack.