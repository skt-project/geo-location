const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const router = express.Router();

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: credentials,
});

router.post('/', async (req, res) => {
  const { store_id, store_name, distributor, region, spv, longitude, latitude, calendar_date } = req.body;

  const rows = {
    store_id,
    store_name,
    distributor,
    region,
    spv,
    longitude,
    latitude,
    calendar_date
  };

  console.log("Payload to BigQuery:", rows);

  try {
    await bigquery
      .dataset(process.env.BQ_DATASET_ID)
      .table(process.env.BQ_LOC_ID)
      .insert([rows]);

    console.log("Insert success");
    res.status(200).json({ message: "Location inserted into BigQuery!" });
  } catch (err) {
    console.error('BigQuery insert error:', JSON.stringify(err, null, 2));
    // Extra detailed logging if it's a PartialFailureError
    if (err.name === 'PartialFailureError' && err.errors) {
      err.errors.forEach((insertError, index) => {
        console.error(`Row ${index} insert error:`, insertError.errors);
      });
    }

    res.status(500).json({
      message: "Failed to insert into BigQuery",
      error: err.message,
      details: err.errors || null
    });
  }
});

module.exports = router;
