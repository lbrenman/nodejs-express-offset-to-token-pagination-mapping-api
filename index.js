require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4000;

const API_KEY = process.env.API_KEY;
const UPSTREAM_API_KEY = process.env.UPSTREAM_API_KEY;
const UPSTREAM_API_URL = process.env.UPSTREAM_API_URL;
const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_LIMIT) || 10;
const DEFAULT_OFFSET = parseInt(process.env.DEFAULT_OFFSET) || 0;

// Middleware: API key auth
app.use((req, res, next) => {
  const clientKey = req.headers['x-api-key'];
  if (clientKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// GET /fdx-items?limit=10&offset=30
app.get('/fdx-items', async (req, res) => {
  const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
  const offset = parseInt(req.query.offset) || DEFAULT_OFFSET;

  try {
    let currentOffset = 0;
    let pageToken = null;

    while (currentOffset + limit <= offset) {
      const response = await axios.get(UPSTREAM_API_URL, {
        headers: { 'x-api-key': UPSTREAM_API_KEY },
        params: {
          pageSize: limit,
          pageToken: pageToken
        }
      });

      if (!response.data.nextPageToken) {
        return res.status(416).json({ error: 'Offset exceeds data bounds' });
      }

      currentOffset += limit;
      pageToken = response.data.nextPageToken;
    }

    const finalPage = await axios.get(UPSTREAM_API_URL, {
      headers: { 'x-api-key': UPSTREAM_API_KEY },
      params: {
        pageSize: limit,
        pageToken: pageToken
      }
    });

    const upstreamItems = finalPage.data.items || [];
    const sliceStart = offset - currentOffset;
    const slicedItems = upstreamItems.slice(sliceStart, sliceStart + limit);

    res.json({
      limit,
      offset,
      total: finalPage.data.total,
      items: slicedItems
    });

  } catch (error) {
    console.error('Upstream API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from upstream' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Offset-based proxy running at http://localhost:${PORT}`);
});
