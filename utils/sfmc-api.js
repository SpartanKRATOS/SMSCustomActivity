const axios = require('axios');
const logger = require('./logger');

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
      scope: "data_extensions_read data_extensions_write",
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
      "grant_type": "client_credentials",
      "client_id": "06fi09kvmru22lrfgwgkehek",
      "client_secret": "hwItfvcRJbyFGtW7Dy6mFtJE",
      "scope": "data_extensions_write",
      "account_id": "510000545"
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(res => {
    logger.info("STS", res)
  }).catch(err => {
    logger.error("Error", err)
  })

const getCampaignOfferTypes = async (accessToken) =>
  axios({
    method: 'get',
    url: `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/data/v1/customobjectdata/key/3122D19A-435E-451C-9CCE-3C1EE28F2869/rowset`,
    headers: { Authorization: accessToken },
  });

const getCampaignProductTypes  = async (accessToken) =>
  axios({
    method: 'get',
    url: `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/data/v1/customobjectdata/key/5CCEC2D1-D240-4729-B979-62573647E3D3/rowset`,
    headers: { Authorization: accessToken },
  });

module.exports = { getWebAppToken, getUserInfo, getCampaignOfferTypes, getCampaignProductTypes, getSTSAppToken };