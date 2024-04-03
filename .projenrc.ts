import { awscdk } from 'projen';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-puppeteer',
  projenrcTs: true,

  deps: [
    'puppeteer@^22',
    '@sparticuz/chromium@^123',
    '@aws-sdk/client-s3@^3',
    '@aws-sdk/s3-request-presigner@^3',
  ],

  devDeps: [
    '@types/aws-lambda',
  ],
});

project.addGitIgnore('.idea');

project.synth();