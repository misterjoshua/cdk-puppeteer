import { App } from 'aws-cdk-lib';
import { CdkPuppeteerStack } from './CdkPuppeteerStack';

const app = new App();

new CdkPuppeteerStack(app, 'cdk-puppeteer-dev', {
  // for development, use account/region from cdk cli
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();