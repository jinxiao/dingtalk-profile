/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
  async fetch(request) {
      try {
          const url = 'https://api.dingtalk.com/v1.0/contact/users/me';
          const authorization = request.headers.get('authorization') || '';
          const accessToken = authorization.replace('Bearer ', '');

          if (!accessToken) {
              return new Response(JSON.stringify({ error: 'Missing access token' }), { status: 400 });
          }

          const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'x-acs-dingtalk-access-token': accessToken,
              },
          });

          if (!response.ok) {
              return new Response(JSON.stringify({ error: 'Failed to fetch user info' }), { status: response.status });
          }

          const userInfo = await response.json();
          const result = {
              sub: userInfo.openId,
              nickname: userInfo.nick,
              name: userInfo.nick,
              email: userInfo.email,
          };

          return new Response(JSON.stringify(result), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
          });
      } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
  },
};