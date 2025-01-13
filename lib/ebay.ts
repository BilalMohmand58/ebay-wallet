import axios from 'axios';

const EBAY_APP_ID = process.env.EBAY_APP_ID || '';
const EBAY_CERT_ID = process.env.EBAY_CERT_ID || '';
const EBAY_RU_NAME = process.env.EBAY_RU_NAME || '';

// Production URLs
const OAUTH_URL = 'https://auth.ebay.com/oauth2/authorize';
const TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const API_URL = 'https://api.ebay.com/sell/fulfillment/v1/order';

export const getAuthUrl = () => {
  const scopes = [
    'https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/sell.inventory',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
  ].join('%20');

  const params = new URLSearchParams({
    client_id: EBAY_APP_ID,
    response_type: 'code',
    redirect_uri: EBAY_RU_NAME,
    scope: scopes,
    prompt: 'login',
  });

  return `${OAUTH_URL}?${params.toString()}`;
};

export const getAccessToken = async (code: string) => {
  try {
    const response = await axios.post(TOKEN_URL, 
      `grant_type=authorization_code&code=${code}&redirect_uri=${EBAY_RU_NAME}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${EBAY_APP_ID}:${EBAY_CERT_ID}`).toString('base64')}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export const getOrders = async (accessToken: string) => {
  try {
    // Using the newer Fulfillment API for production
    const response = await axios.get(`${API_URL}?limit=50&offset=0`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'  // Adjust for your target marketplace
      }
    });

    const orders = response.data.orders || [];
    return orders.map((order: any) => ({
      orderId: order.orderId,
      title: order.lineItems[0]?.title || 'Untitled Order',
      status: order.orderFulfillmentStatus,
      createdDate: new Date(order.creationDate).toLocaleDateString(),
      total: {
        value: order.totalFeeBasisAmount.value,
        currency: order.totalFeeBasisAmount.currency
      }
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};