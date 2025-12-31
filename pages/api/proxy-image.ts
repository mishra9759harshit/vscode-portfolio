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

    // Array of user agents to rotate and prevent blocking
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    ];

    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    // Advanced headers to mimic browser behavior
    const headers: HeadersInit = {
      'User-Agent': randomUserAgent,
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    };

    // Add referer based on image source to further prevent blocking
    if (url.hostname.includes('instagram') || url.hostname.includes('cdninstagram')) {
      headers['Referer'] = 'https://www.instagram.com/';
    } else if (url.hostname.includes('linkedin')) {
      headers['Referer'] = 'https://www.linkedin.com/';
    } else if (url.hostname.includes('github')) {
      headers['Referer'] = 'https://github.com/';
    } else {
      headers['Referer'] = url.origin + '/';
    }

    // Fetch the image from the remote server with advanced headers
    let response = await fetch(imageUrl, {
      headers,
      // Increase timeout to 10 seconds for larger images
      signal: AbortSignal.timeout(10000),
      // Disable redirect limiting for some services
      redirect: 'follow',
    });

    // If first attempt fails, retry with different approach
    if (!response.ok && response.status === 403) {
      // Try without referer for 403 Forbidden
      const retryHeaders = { ...headers };
      delete retryHeaders['Referer'];
      
      response = await fetch(imageUrl, {
        headers: retryHeaders,
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
      });
    }

    // If still failing with 403, try direct fetch without most headers
    if (!response.ok && response.status === 403) {
      response = await fetch(imageUrl, {
        headers: {
          'User-Agent': randomUserAgent,
          'Accept': 'image/*',
        },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
      });
    }

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ error: `Failed to fetch image: ${response.statusText}` });
    }

    // Get the image content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Validate that we got an actual image
    if (!contentType.startsWith('image/')) {
      console.error(`Invalid content type: ${contentType}`);
      return res.status(400).json({ error: 'Invalid content type - not an image' });
    }

    // Set cache headers for 7 days (604800 seconds)
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Add ETag for browser caching
    const eTag = `"${Date.now()}-${url.hostname}"`;
    res.setHeader('ETag', eTag);

    // Stream the image back to the client
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Set content length for proper streaming
    res.setHeader('Content-Length', buffer.length);
    
    res.send(buffer);
  } catch (error: any) {
    console.error('Image proxy error:', error?.message || error);
    
    // Return a more informative error response
    const errorMessage = error?.message || 'Unknown error';
    if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
      return res.status(504).json({ error: 'Image fetch timeout - server took too long to respond' });
    }
    
    return res.status(500).json({ error: 'Failed to proxy image: ' + errorMessage });
  }
}
