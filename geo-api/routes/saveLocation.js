const { Router } = require('express');
const { existsSync, readFileSync, writeFileSync } = require('fs');

const router = Router();

router.post('/saveLocation', (req, res) => {
  const { lat, lng } = req.body;

  const filePath = './data/locations.json';

  if (!existsSync(filePath)) {
    writeFileSync(filePath, JSON.stringify([]));
  }

  const locationsData = JSON.parse(readFileSync(filePath, 'utf-8'));

  const newLocation = { lat, lng };
  locationsData.push(newLocation);

  writeFileSync(filePath, JSON.stringify(locationsData, null, 2));

  res.json({ success: true });
});

module.exports = router;
