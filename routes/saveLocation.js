const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const router = express.Router();

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: credentials,
});

router.post('/', async (req, res) => {
  const { storeId, storeName, distributor, region, spv, longitude, latitude, calendar_date } = req.body;

  const rows = [{
    store_id: storeId,
    store_name: storeName,
    distributor,
    region,
    spv,
    longitude,
    latitude,
    calendar_date
  }];

  try {
    await bigquery
      .dataset(process.env.BQ_DATASET_ID)
      .table(process.env.BQ_LOC_ID)
      .insert(rows);

    res.status(200).json({ message: "Location inserted into BigQuery!" });
  } catch (err) {
    console.error('BigQuery insert error:', err);
    res.status(500).json({ message: "Failed to insert into BigQuery", error: err });
  }
});

module.exports = router;
