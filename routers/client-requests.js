const router = require('express').Router();
const sfmcAPI = require('../utils/sfmc-api');
const logger = require('../utils/logger');

/**
 * This is a test endpoint. Modify it to fit your needs.
 */
router.post('/test', async (req, res) => {
  if (req.body.access_token) {
    try {
      const userInfoReq = await sfmcAPI.getUserInfo(req.body.access_token);

      if (userInfoReq.status === 200 && userInfoReq.data) {
        logger.info(
          `${req.url} endpoint executed by '${userInfoReq.data.user.name}' with username '${userInfoReq.data.user.preferred_username}' within application '${userInfoReq.data.application.name}' with id '${userInfoReq.data.application.id}' on '${userInfoReq.data.organization.member_id}' BU`
        );

        res.status(200).json({ status: 'ok' });
      } else {
        logger.error(`${req.url} endpoint: userInfo missing`);
        res.status(401).json({ status: 'error' });
      }
    } catch (err) {
      logger.error(`${req.url} endpoint: wrong access_token`);
      res.status(401).json({ status: 'error' });
    }
  } else {
    logger.error(`${req.url} endpoint: access token missing`);
    res.status(401).json({ status: 'error' });
  }
});

/**
 * This is a dropdown values endpoint. Modify it to fit your needs.
 * it returns either mock data or real data via REST
 */
router.post('/campaign-offer-data', async (req, res) => {
  if (req.body.access_token) {
    try {
      const userInfoReq = await sfmcAPI.getUserInfo(req.body.access_token);

      if (userInfoReq.status === 200 && userInfoReq.data) {
        logger.info(
          `${req.url} endpoint executed by '${userInfoReq.data.user.name}' with username '${userInfoReq.data.user.preferred_username}' within application '${userInfoReq.data.application.name}' with id '${userInfoReq.data.application.id}' on '${userInfoReq.data.organization.member_id}' BU`
        );

        // const dataD = await sfmcAPI.getCampaignOfferTypes(req.body.access_token)

        const campaignsOffersTypes = [
          {
            id: 1,
            value: "PRE-APPROVED"
          },
          {
            id: 2,
            value: "PRE-SELECTED"
          }
        ]

        res.status(200).json({ data: campaignsOffersTypes });
      } else {
        logger.error(`${req.url} endpoint: userInfo missing`);
        res.status(401).json({ status: 'error' });
      }
    } catch (err) {
      logger.error(`${req.url} endpoint: wrong access_token`);
      res.status(401).json({ status: 'error' });
    }
  } else {
    logger.error(`${req.url} endpoint: access token missing`);
    res.status(401).json({ status: 'error' });
  }
});

router.post('/campaign-product-type', async (req, res) => {
  if (req.body.access_token) {
    try {
      const userInfoReq = await sfmcAPI.getUserInfo(req.body.access_token);

      if (userInfoReq.status === 200 && userInfoReq.data) {
        logger.info(
          `${req.url} endpoint executed by '${userInfoReq.data.user.name}' with username '${userInfoReq.data.user.preferred_username}' within application '${userInfoReq.data.application.name}' with id '${userInfoReq.data.application.id}' on '${userInfoReq.data.organization.member_id}' BU`
        );

        //const authSTS = await sfmcAPI.getSTSAppToken();
        // const accessTokenSTS = authSTS.data.access_token;
        
        const dataD = await sfmcAPI.getCampaignProductTypes(req.body.access_token)

        const campaignsProductTypes = [
          {
            id: 1,
            value: "PRE-APPROVED"
          },
          {
            id: 2,
            value: "PRE-SELECTED"
          },
          {
            id: 3,
            value: JSON.stringify(dataD)
          }
        ]

        res.status(200).json({ data: campaignsProductTypes });
      } else {
        logger.error(`${req.url} endpoint: userInfo missing`);
        res.status(401).json({ status: 'error' });
      }
    } catch (err) {
      logger.error(`${req.url} endpoint: wrong access_token`);
      res.status(401).json({ status: 'error' });
    }
  } else {
    logger.error(`${req.url} endpoint: access token missing`);
    res.status(401).json({ status: 'error' });
  }
});

module.exports = router;
