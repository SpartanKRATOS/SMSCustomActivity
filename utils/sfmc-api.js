const axios = require('axios');

const getWebAppToken = async (authcode, domain) =>
  axios({
    method: 'post',
    url: `https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`,
    data: {
      grant_type: 'authorization_code',
      code: authcode,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: `https://${domain}/authenticated`,
    },
  });

const getUserInfo = async (accessToken) =>
  axios({
    method: 'get',
    url: `https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/userinfo`,
    headers: { Authorization: accessToken },
  });

const getSTSAppToken = async () =>
  axios.post(`https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`, {
      grant_type: 'client_credentials',
      client_id: "06fi09kvmru22lrfgwgkehek",
      client_secret: "hwItfvcRJbyFGtW7Dy6mFtJE",
      account_id: "510000545",
      scope: "data_extensions_read data_extensions_write"
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

const getCampaignOfferTypes = async (accessToken) =>
  axios({
    method: 'get',
    url: `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/data/v1/async/{requestId}/2E32C105-FCDE-4154-97C7-AE57373D7008/results`,
    headers: { Authorization: accessToken },
  });

module.exports = { getWebAppToken, getUserInfo, getCampaignOfferTypes, getSTSAppToken };