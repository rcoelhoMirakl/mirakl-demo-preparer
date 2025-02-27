const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.use('/api', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `https://rcoelho7-dev.mirakl.net${req.path}`,
      headers: {
        'Authorization': req.headers['authorization'],
        'Accept': 'application/json',
      },
      data: req.body,
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.message);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
