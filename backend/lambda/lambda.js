const serverlessExpress = require('@vendia/serverless-express');
const createApp = require('./app');

let app;
try {
  app = createApp();
  console.log('Lambda function initialized successfully');
} catch (err) {
  console.error('Lambda initialization error:', err);
  throw err;
}

const handler = serverlessExpress({ app });
exports.handler = async (event, context) => {
  return await handler(event, context);
};