import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { FunctionUrl, FunctionUrlAuthType, HttpMethod, InvokeMode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CdkPuppeteerStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // Create an S3 bucket to store the screenshots
    const outputBucket = new Bucket(this, 'OutputBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Automatically delete objects after 30 days
    outputBucket.addLifecycleRule({
      expiration: Duration.days(30),
      prefix: 'temp-output',
    });

    // Create a Lambda function that takes a screenshot of a website
    const handler = new NodejsFunction(this, 'Handler', {
      runtime: Runtime.NODEJS_LATEST,
      memorySize: 8192,
      timeout: Duration.seconds(30),
      bundling: {
        // This module is required but doesn't survive bundling.
        nodeModules: ['@sparticuz/chromium'],
      },
    });

    // Let the handler read/write to the output bucket
    outputBucket.grantReadWrite(handler);
    handler.addEnvironment('OUTPUT_BUCKET_NAME', outputBucket.bucketName);
    handler.addEnvironment('OUTPUT_BUCKET_REGION', this.region);

    // Create a URL to invoke the Lambda function
    const functionUrl = new FunctionUrl(this, 'FunctionUrl', {
      function: handler,
      invokeMode: InvokeMode.BUFFERED,
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
        allowedMethods: [HttpMethod.ALL],
      },
    });

    // Display the URL in the CloudFormation outputs.
    new CfnOutput(this, 'Url', {
      value: functionUrl.url,
    });
  }
}
