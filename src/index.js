const fetch = require('node-fetch');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const docClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || 'renderCache';

const handler = async (event) => {
  const URL = (() => {
    if (event) {
      if (event.queryStringParameters) {
        if (event.queryStringParameters.url) return event.queryStringParameters.url;
      }
    }
  })();

  if (!URL)
    return {
      statusCode: 400,
      body: 'Missing URL in query string!',
      headers: {
        'Content-Type': 'text/plain'
      }
    };

  let data = await getCachedData(URL);
  if (!data || !data.html) data = await fetchData(URL);

  return {
    statusCode: 200,
    body: parseHtml(data.html),
    headers: {
      'Content-Type': 'text/html'
    }
  };
};

function parseHtml(html) {
  try {
    return JSON.parse(html);
  } catch (error) {
    return html;
  }
}

async function getCachedData(url) {
  console.info('Getting cached data');
  const params = {
    TableName: TABLE_NAME,
    Key: { url: url }
  };

  return new Promise((resolve, reject) => {
    docClient.get(params, (error, data) => {
      if (error) {
        console.error('Error', error);
        reject();
      }
      if (data) {
        if (data.Item) resolve(data.Item);
      }
      resolve();
    });
  });
}

async function putCachedData(url, data) {
  console.info('Putting data in cache');
  const params = {
    TableName: TABLE_NAME,
    Item: {
      url: url,
      html: JSON.stringify(data)
    }
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (error, data) => {
      if (error) {
        console.log('Error', error);
        reject();
      } else {
        console.log('Success', data);
        resolve();
      }
    });
  });
}

async function fetchData(url) {
  console.info('Fetching data');
  const data = await fetch(url).then(async (data) => await data.text());
  await putCachedData(url, data);
  return {
    html: data
  };
}

module.exports.handler = handler;
