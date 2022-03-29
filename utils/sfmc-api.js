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

const getCampaignOfferTypes = async (accessToken) =>
  axios({
    method: 'get',
    url: `https://www.exacttargetapis.com/data/v1/customobjectdata/key/2E32C105-FCDE-4154-97C7-AE57373D7008/rowset`,
    headers: { Authorization: accessToken },
  });

module.exports = { getWebAppToken, getUserInfo, getCampaignOfferTypes };