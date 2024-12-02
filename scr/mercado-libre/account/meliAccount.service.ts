import axios from 'axios';
import { MeliAccount } from './meliAccount.entity.js';

const endpoint_base = process.env.MELI_API_URL;
const clientId = process.env.MELI_APP_ID;
const clientSecret = process.env.MELI_CLIENT_SECRET;

async function oauth(code: string) {
  const redirectUri = process.env.MELI_REDIRECT_URI;
  const body = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
  };
  try {
    const response = await axios.post(`${endpoint_base}/oauth/token`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function refreshToken(meliAccount: MeliAccount) {
  const body = {
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: meliAccount.refreshToken,
  };
  try {
    const response = await axios.post(`${endpoint_base}/oauth/token`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function revokeGrant(meliAccount: MeliAccount) {
  const endpoint = `${endpoint_base}/users/${meliAccount.user_id}/applications/${clientId}`;
  try {
    const response = await axios.delete(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meliAccount.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const meliAccountService = { oauth, refreshToken, revokeGrant };
