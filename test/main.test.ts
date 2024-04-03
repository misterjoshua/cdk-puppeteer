import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { CdkPuppeteerStack } from '../src/CdkPuppeteerStack';

test('Snapshot', () => {
  const app = new App();
  const stack = new CdkPuppeteerStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});