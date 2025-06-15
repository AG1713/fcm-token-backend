const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const app = express();
const PORT = process.env.PORT || 3000;

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

// Load service account key from file
const serviceAccount = require('./service-account.json'); // <-- rename your downloaded JSON to this

let cachedToken = null;
let cachedAt = 0;

const getAccessToken = async () => {
  const now = Date.now();
  const isExpired = !cachedToken || now - cachedAt > 50 * 60 * 1000; // 50 minutes
  if (!isExpired) return cachedToken;

  const auth = new GoogleAuth({ credentials: serviceAccount, scopes: SCOPES });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  cachedToken = tokenResponse.token;
  cachedAt = now;

  return cachedToken;
};

app.get('/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ accessToken: token });
  } catch (error) {
    console.error('Error getting token:', error);
    res.status(500).json({ error: 'Failed to retrieve access token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
