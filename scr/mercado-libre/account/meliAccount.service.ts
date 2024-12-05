import axios, { AxiosError } from 'axios';
import { MeliAccount } from './meliAccount.entity.js';
import { ApiResponseError } from '../../shared/utils/errors.js';

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
  } catch (error: any) {
    throw new ApiResponseError(
      error.response.data.message ?? 'Error validating grant',
      error.response.status,
      'Error validating grant'
    );
  }
}

async function refreshToken(
  meliAccount: MeliAccount
): Promise<{ accessToken: string; refreshToken: string }> {
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

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  } catch (error: any) {
    throw new ApiResponseError(
      error.response.data.message ?? 'Error refreshing token',
      error.response.status,
      'Error refreshing token'
    );
  }
}

async function revokeGrant(meliAccount: MeliAccount) {
  const endpoint = `${endpoint_base}/users/${meliAccount.userId}/applications/${clientId}`;
  try {
    const response = await axios.delete(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meliAccount.accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new ApiResponseError(
      error.response.data.message ?? 'Error revoking grant',
      error.response.status,
      'Error revoking grant'
    );
  }
}

async function getNickname(meliAccount: MeliAccount): Promise<string> {
  const endpoint = `${endpoint_base}/users/${meliAccount.userId}`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meliAccount.accessToken}`,
      },
    });
    return response.data.nickname;
  } catch (error: any) {
    throw new ApiResponseError(
      error.response.data.message ?? 'Error getting nickname',
      error.response.status,
      'Error getting nickname'
    );
  }
}

export const meliAccountService = {
  oauth,
  refreshToken,
  revokeGrant,
  getNickname,
};
