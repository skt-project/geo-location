require('dotenv').config();
const express = require('express');
const cors = require('cors');
const storeDataRoute = require('./routes/storeData');
const locationRoute = require('./routes/saveLocation');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/store-data', storeDataRoute);
app.use('/api/location', locationRoute);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
