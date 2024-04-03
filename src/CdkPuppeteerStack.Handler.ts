import { randomUUID } from 'node:crypto';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import chromium from '@sparticuz/chromium';

import type * as lambda from 'aws-lambda';
import puppeteer from 'puppeteer';

// Configure the output location.
const outputBucketName = process.env.OUTPUT_BUCKET_NAME!;
const outputBucketClient = new S3({
  region: process.env.OUTPUT_BUCKET_REGION!,
});

export const handler: lambda.APIGatewayProxyHandlerV2 = async () => {
  // Launch puppeteer with sparticuz's chromium distro.
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    // Get a screenshot
    const page = await browser.newPage();
    await page.goto('https://aws.amazon.com/');
    const screenshot = await page.screenshot();

    // Write it to s3
    const outputKey = `temp-output/${randomUUID()}.png`;
    await outputBucketClient.putObject({
      Bucket: outputBucketName,
      Key: outputKey,
      Body: screenshot,
      ContentType: 'image/png',
    });

    // Generate a pre-signed URL to download the screenshot
    const downloadUrl = await getSignedUrl(outputBucketClient, new GetObjectCommand({
      Bucket: outputBucketName,
      Key: outputKey,
    }), { expiresIn: 60 * 60 });

    // Return the URL
    return {
      statusCode: 200,
      body: JSON.stringify({
        downloadUrl,
      }),
    };
  } finally {
    await browser.close();
  }
};