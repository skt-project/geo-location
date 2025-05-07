const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const router = express.Router();

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: credentials,
});

router.get('/', async (req, res) => {
  const query = `
    SELECT upper(spv) as spv, upper(region) as region, upper(distributor) as distributor, cust_id AS store_id, store_name
    FROM \`${process.env.GOOGLE_PROJECT_ID}.${process.env.BQ_DATASET_ID}.${process.env.BQ_TABLE_ID}\`
    WHERE spv IS NOT NULL OR spv = ""
  `;

  try {
    const [rows] = await bigquery.query({ query });
    res.json(rows);
  } catch (err) {
    console.error('BigQuery error:', err);
    res.status(500).send('Failed to fetch store data');
  }
});

module.exports = router;
