const express = require('express');
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const hostname = '127.0.0.1';
const port = 3000;

const client_id = '517b60decf434a6687c88798ec89c000';
const client_secret = require('./client.js').client_secret;
const redirect_uri = `http://localhost:3000/callback`;
const stateKey = 'spotify_auth_state';

const app = express();
app.use(cookieParser());

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'user-read-private user-read-email';
  const response_type = 'code';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      client_id,
      response_type,
      redirect_uri,
      state,
      scope
    }));
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const stateCookie = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== stateCookie) {
    res.clearCookie(stateKey);
    res.redirect('/error');
  } else {
    res.clearCookie(stateKey);
    const grant_type = 'authorization_code';
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, (err, response, body) => {
      if (!err && res.statusCode === 200) {
        const { access_token, refresh_token } = body;
        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        }

        request.get(options, (err, response, body) => {
          console.log(body);
        });

        res.redirect('/#' +
          querystring.stringify({
            access_token,
            refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {
  const refresh_token = req.query.refresh_token;
  const grant_type = 'refresh_token';
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type,
      refresh_token
    },
    json: true
  };

  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
})

app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}`);
});

function generateRandomString(length) {
  const charBank = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let string = '';

  for (let i = 0; i < length; i++) {
    string += charBank.charAt(Math.floor(Math.random() * charBank.length));
  }
  return string;
}
