const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    message: 'Debug endpoint - timestamp should be current',
    server_time: new Date().toISOString()
  });
});

module.exports = router;