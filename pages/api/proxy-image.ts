import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageUrl = req.query.url as string;

  if (!imageUrl) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    // Validate that it's an HTTPS URL
    const url = new URL(imageUrl);
    if (!url.protocol.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Fetch the image from the remote server
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      // Set timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    // Get the image content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Set cache headers for 7 days
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Content-Type', contentType);

    // Stream the image back to the client
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    return res.status(500).json({ error: 'Failed to proxy image' });
  }
}
