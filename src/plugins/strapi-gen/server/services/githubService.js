'use strict';

const fetch = require('node-fetch');

module.exports = {
  async exchangeCodeForAccessToken(code) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: 'e9d29cdcac4030c9ba3f',
        client_secret: '7b7d8b83b9924c43e7b58770f8b25788640ae3b0',
        code,
      }),
    });
    const data = await response.json();
    return data.access_token;
  },

  async createRepository(name, accessToken) {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return response.json();
  }
};