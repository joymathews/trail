const serverlessExpress = require('@vendia/serverless-express');
const createApp = require('./app');

const app = createApp();

exports.handler = serverlessExpress({ app });