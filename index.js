const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const app = express();
const PORT = process.env.PORT || 3000;

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

// Load service account key from file
const serviceAccount = require('./service-account.json'); // <-- rename your downloaded JSON to this

const getAccessToken = async () => {
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
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
