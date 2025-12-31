import type { NextApiRequest, NextApiResponse } from 'next';

function extractMeta(content: string, key: string) {
  const re = new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i');
  const m = content.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i');
  const m2 = content.match(re2);
  if (m2) return m2[1];
  return null;
}

function cleanName(name: string): string {
  if (!name) return '';
  return name
    .replace(/\s*[-•|]\s*(Profile|@.+|Profiles|Posts|•.*)?$/, '')
    .replace(/\s*\(@.*\)$/, '')
    .trim();
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    // Check if it's an image URL based on domain patterns
    const imageHosts = [
      'instagram',
      'cdninstagram',
      'fbcdn',
      'scontent',
      'linkedin',
      'akamai',
      'media-exp',
      'platform-lookaside',
      'lcdn',
      'githubusercontent',
      'avatars',
      'cloudfront',
      'imgix',
      'amazonaws',
      'fastly'
    ];
    return imageHosts.some(host => parsed.hostname.includes(host)) || parsed.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  } catch {
    return false;
  }
}

function cleanUrl(url: string): string {
  if (!url) return '';
  
  // Remove backslash escapes
  url = url.replace(/\\/g, '');
  
  // Decode HTML entities
  try {
    url = decodeURIComponent(url);
  } catch {
    // Continue if decode fails
  }
  
  // Handle unicode escapes
  url = url.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  // Remove tracking parameters while preserving image integrity
  url = url.replace(/[?&](utm_|fbclid|igsh|__cft__|_nc_)/g, '');
  
  // Ensure it's an absolute URL
  if (!url.startsWith('http')) {
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else if (url.startsWith('/')) {
      // Relative path - cannot determine domain
      return '';
    }
  }
  
  return url.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const platform = String(req.query.platform || '').toLowerCase();
  const username = String(req.query.username || '').trim();
  if (!platform || !username) return res.status(400).json({ error: 'platform and username required' });

  try {
    if (platform === 'github') {
      // GitHub API - most reliable
      const r = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: {
          'User-Agent': 'PortfolioApp/1.0',
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (!r.ok) return res.status(404).json({ error: 'GitHub user not found' });
      const j = await r.json();
      return res.status(200).json({
        name: j.name || j.login || username,
        avatar: j.avatar_url || '',
      });
    }

    // For Instagram and LinkedIn, try multiple approaches
    const targets: { url: string; platform: string }[] =
      platform === 'instagram'
        ? [
            { url: `https://www.instagram.com/${encodeURIComponent(username)}/`, platform: 'instagram' },
            { url: `https://instagram.com/${encodeURIComponent(username)}/`, platform: 'instagram' },
          ]
        : [
            { url: `https://www.linkedin.com/in/${encodeURIComponent(username)}/`, platform: 'linkedin' },
            { url: `https://linkedin.com/in/${encodeURIComponent(username)}/`, platform: 'linkedin' },
          ];

    let ogTitle = '';
    let ogImage = '';
    let statusCode = 404;
    const foundImages: string[] = [];

    for (const target of targets) {
      try {
        const r = await fetch(target.url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Referer': 'https://www.google.com/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Upgrade-Insecure-Requests': '1',
          },
          // Set shorter timeout for faster failure
          signal: AbortSignal.timeout(10000),
        });

        statusCode = r.status;

        // Handle 304 Not Modified by retrying without caching validation headers
        if (r.status === 304) {
          try {
            const retryR = await fetch(target.url, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Referer': 'https://www.google.com/',
              },
              signal: AbortSignal.timeout(10000),
            });
            
            if (retryR.ok) {
              const text = await retryR.text();
              statusCode = 200;
              
              // Process the text content (same as below)
              const is404Page =
                text.includes('404') ||
                text.includes('not found') ||
                text.includes('page not found') ||
                (text.length < 5000 && text.includes('error'));

              if (!is404Page || ogTitle) {
                // Try to read Open Graph tags
                const metaTitle = extractMeta(text, 'og:title') || extractMeta(text, 'twitter:title');
                if (metaTitle) ogTitle = metaTitle;

                let metaImage = extractMeta(text, 'og:image') || extractMeta(text, 'twitter:image');
                
                if (!metaImage) {
                  metaImage = extractMeta(text, 'og:image:url') || extractMeta(text, 'og:image:secure_url');
                }
                
                if (metaImage && isValidImageUrl(metaImage)) {
                  ogImage = metaImage;
                }

                // Extract platform-specific data (same logic as main flow)
                if (platform === 'instagram') {
                  ogImage = extractInstagramImage(text, ogImage, foundImages);
                  ogTitle = extractInstagramName(text, ogTitle, username);
                } else if (platform === 'linkedin') {
                  ogImage = extractLinkedInImage(text, ogImage, foundImages);
                  ogTitle = extractLinkedInName(text, ogTitle, username);
                }

                if (ogTitle || ogImage) {
                  break;
                }
              }
            }
          } catch {
            // Continue to next URL if retry fails
            continue;
          }
          continue;
        }

        if (r.ok || r.status === 200) {
          const text = await r.text();

          // Check if page actually contains profile content (not 404 page)
          const is404Page =
            text.includes('404') ||
            text.includes('not found') ||
            text.includes('page not found') ||
            (text.length < 5000 && text.includes('error'));

          if (is404Page && !ogTitle) {
            continue;
          }

          // Try to read Open Graph tags
          const metaTitle = extractMeta(text, 'og:title') || extractMeta(text, 'twitter:title');
          if (metaTitle) ogTitle = metaTitle;

          let metaImage = extractMeta(text, 'og:image') || extractMeta(text, 'twitter:image');
          
          // Try additional image meta tags
          if (!metaImage) {
            metaImage = extractMeta(text, 'og:image:url') || extractMeta(text, 'og:image:secure_url');
          }
          
          if (metaImage && isValidImageUrl(metaImage)) {
            ogImage = metaImage;
          }

          // For Instagram - advanced image extraction
          if (platform === 'instagram' && !ogImage) {
            ogImage = extractInstagramImage(text, ogImage, foundImages);
            ogTitle = extractInstagramName(text, ogTitle, username);
          }

          // For LinkedIn - advanced image extraction
          if (platform === 'linkedin' && !ogImage) {
            ogImage = extractLinkedInImage(text, ogImage, foundImages);
            ogTitle = extractLinkedInName(text, ogTitle, username);
          }

          // Also try extracting from JSON-LD structured data (global fallback)
          if (!ogTitle) {
            const jsonldMatches = text.match(/<script[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/gi);
            if (jsonldMatches) {
              for (const jsonldMatch of jsonldMatches) {
                try {
                  const jsonContent = jsonldMatch.match(/>([^<]+)<\/script>/);
                  if (jsonContent) {
                    const jsonld = JSON.parse(jsonContent[1]);
                    if (jsonld.name) {
                      ogTitle = jsonld.name;
                      if (!ogImage && jsonld.image) {
                        const imgUrl = typeof jsonld.image === 'string' ? jsonld.image : jsonld.image.url;
                        if (isValidImageUrl(imgUrl)) {
                          ogImage = imgUrl;
                          foundImages.push(ogImage);
                        }
                      }
                      break;
                    }
                    if (jsonld.author?.name && !ogTitle) {
                      ogTitle = jsonld.author.name;
                    }
                    if (!ogImage && jsonld.image) {
                      const imgUrl = typeof jsonld.image === 'string' ? jsonld.image : jsonld.image.url;
                      if (isValidImageUrl(imgUrl)) {
                        ogImage = imgUrl;
                        foundImages.push(ogImage);
                      }
                    }
                  }
                } catch (e) {
                  // Continue to next JSON-LD block
                }
              }
            }
          }

          // Use the first valid image found if current selection is invalid
          if (!ogImage && foundImages.length > 0) {
            ogImage = foundImages[0];
          }

          // Fallback: use username as name
          if (!ogTitle) {
            ogTitle = username;
          }

          if (ogTitle || ogImage) {
            break; // Successfully found data
          }
        }
      } catch (err) {
        // Try next URL
        continue;
      }
    }

    // Set response headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // If we got data or the profile likely exists (got a 200 response), return it
    if (ogTitle || ogImage) {
      const name = cleanName(ogTitle) || username;
      let avatar = ogImage;
      
      // For Instagram and LinkedIn, proxy the image through our server
      // This helps avoid CORS issues and Instagram/LinkedIn blocking direct requests
      if (avatar && (platform === 'instagram' || platform === 'linkedin')) {
        try {
          avatar = `/api/proxy-image?url=${encodeURIComponent(avatar)}`;
        } catch (e) {
          // If URL encoding fails, use the original URL
        }
      }
      
      return res.status(200).json({ name, avatar });
    }

    // If we found at least one successful response, use fallback
    if (statusCode === 200) {
      return res.status(200).json({ name: username, avatar: '' });
    }

    return res.status(404).json({ error: `${platform} profile not found or is private` });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile. Please try again.';
    console.error('Profile fetch error:', err);
    return res.status(500).json({ error: errorMessage });
  }
}

// Helper function to extract Instagram image
function extractInstagramImage(text: string, currentImage: string, foundImages: string[]): string {
  let ogImage = currentImage;

  // Advanced Method 1: Parse window._sharedData or __data
  const sharedDataMatch = text.match(/window\._sharedData\s*=\s*(\{.+?\});/);
  if (sharedDataMatch && !ogImage) {
    try {
      const sharedData = JSON.parse(sharedDataMatch[1]);
      const profilePicUrl = 
        sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user?.profile_pic_url_hd ||
        sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user?.profile_pic_url ||
        sharedData?.graphql?.user?.profile_pic_url_hd ||
        sharedData?.graphql?.user?.profile_pic_url;
      
      if (profilePicUrl && isValidImageUrl(profilePicUrl)) {
        ogImage = cleanUrl(profilePicUrl);
        foundImages.push(ogImage);
      }
    } catch {
      // Continue with other methods
    }
  }

  // Original methods 1-6
  if (!ogImage) {
    const profilePicMatch = text.match(/"profile_pic_url_hd":"([^"]+)"/);
    if (profilePicMatch) {
      const url = cleanUrl(profilePicMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const profilePicMatch = text.match(/"profile_pic_url":"([^"]+)"/);
    if (profilePicMatch) {
      const url = cleanUrl(profilePicMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const hdPicMatch = text.match(/"hdProfilePicUrlInfo":\s*\{\s*"url":"([^"]+)"/);
    if (hdPicMatch) {
      const url = cleanUrl(hdPicMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const profilePicMatch = text.match(/"user":\s*\{[^}]*"profile_pic_url":"([^"]+)"/);
    if (profilePicMatch) {
      const url = cleanUrl(profilePicMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const altPicMatch = text.match(/"(?:profilePic|profile_image)":"([^"]+)"/);
    if (altPicMatch) {
      const url = cleanUrl(altPicMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const imageMatch = text.match(/"image":"([^"]*(?:cdninstagram|instagram)[^"]*)"/i);
    if (imageMatch) {
      const url = cleanUrl(imageMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  // Advanced Method 4: Look for img tags with srcset (highest quality image)
  if (!ogImage) {
    const imgSrcsetMatch = text.match(/<img[^>]*(?:alt|title)="[^"]*(?:profile|avatar|photo)[^"]*"[^>]*src="([^"]+)"[^>]*(?:srcset="([^"]+)")?/i);
    if (imgSrcsetMatch) {
      const srcset = imgSrcsetMatch[2];
      if (srcset) {
        // Extract highest resolution image from srcset
        const srcsetImages = srcset.split(',').map(s => {
          const parts = s.trim().split(/\s+/);
          return { url: parts[0], width: parseInt(parts[1]) || 0 };
        }).sort((a, b) => b.width - a.width);
        
        if (srcsetImages[0]) {
          const url = cleanUrl(srcsetImages[0].url);
          if (isValidImageUrl(url)) {
            ogImage = url;
            foundImages.push(ogImage);
          }
        }
      } else if (imgSrcsetMatch[1]) {
        const url = cleanUrl(imgSrcsetMatch[1]);
        if (isValidImageUrl(url)) {
          ogImage = url;
          foundImages.push(ogImage);
        }
      }
    }
  }

  return ogImage;
}

// Helper function to extract Instagram name
function extractInstagramName(text: string, currentName: string, username: string): string {
  let ogTitle = currentName;

  if (!ogTitle || ogTitle === username) {
    const fullNameMatch = text.match(/"full_name":"([^"]+)"/);
    if (fullNameMatch && fullNameMatch[1].length > 0) {
      ogTitle = fullNameMatch[1];
    }
  }
  
  if (!ogTitle || ogTitle === username) {
    const bioMatch = text.match(/"biography":"([^"]+)"/);
    if (bioMatch && bioMatch[1].length > 2) {
      const firstLine = bioMatch[1].split('\n')[0];
      if (firstLine.length > 2 && firstLine.length < 50) {
        ogTitle = firstLine;
      }
    }
  }
  
  if (!ogTitle || ogTitle === username) {
    const ownerMatch = text.match(/"owner":\s*\{\s*"username":"([^"]+)"/);
    if (ownerMatch) {
      ogTitle = ownerMatch[1];
    }
  }

  return ogTitle;
}

// Helper function to extract LinkedIn image
function extractLinkedInImage(text: string, currentImage: string, foundImages: string[]): string {
  let ogImage = currentImage;

  // Advanced Method 1: Parse structured data from schema scripts
  const ldJsonMatch = text.match(/<script[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/i);
  if (ldJsonMatch && !ogImage) {
    try {
      const ldJson = JSON.parse(ldJsonMatch[1]);
      const profileImage = 
        ldJson?.image ||
        ldJson?.photo ||
        ldJson?.thumbnailUrl ||
        (Array.isArray(ldJson?.image) ? ldJson.image[0] : null);
      
      if (profileImage && isValidImageUrl(profileImage)) {
        ogImage = cleanUrl(profileImage);
        foundImages.push(ogImage);
      }
    } catch {
      // Continue with other methods
    }
  }

  // Advanced Method 2: Extract from artdeco data embedded in window
  if (!ogImage) {
    const artdecoMatch = text.match(/"profilePictureDisplayImage":"(urn:[^"]+|https:[^"]+)"/);
    if (artdecoMatch) {
      const imageData = artdecoMatch[1];
      if (imageData.startsWith('https')) {
        const url = cleanUrl(imageData);
        if (isValidImageUrl(url)) {
          ogImage = url;
          foundImages.push(ogImage);
        }
      }
    }
  }

  // Original methods 1-6
  if (!ogImage) {
    const linkedinImageMatch = text.match(/"profilePicture":\s*\{\s*"displayImage":"([^"]+)"/);
    if (linkedinImageMatch) {
      const url = cleanUrl(linkedinImageMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const directImageMatch = text.match(/"image":"(https:[^"]*(?:linkedin|akamai|media-exp)[^"]*)"/);
    if (directImageMatch) {
      const url = cleanUrl(directImageMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const avatarMatch = text.match(/"(?:avatar|profilePhoto|picture|profileImage)":"(https:[^"]+)"/i);
    if (avatarMatch) {
      const url = cleanUrl(avatarMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const imgMatch = text.match(/<img[^>]*src="([^"]*(?:linkedin|media-exp|platform-lookaside|lcdn)[^"]*)"[^>]*(?:alt|title)="[^"]*(?:profile|avatar|photo)/i);
    if (imgMatch) {
      const url = cleanUrl(imgMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  if (!ogImage) {
    const profileUrlMatch = text.match(/"profileURL":"([^"]+)"/);
    if (profileUrlMatch) {
      const url = cleanUrl(profileUrlMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  // Advanced Method 3: Extract from picture element (responsive images)
  if (!ogImage) {
    const pictureMatch = text.match(/<picture[^>]*>[\s\S]*?<img[^>]*src="([^"]*(?:linkedin|media-exp|platform-lookaside|lcdn)[^"]*)"[^>]*>[\s\S]*?<\/picture>/i);
    if (pictureMatch) {
      const url = cleanUrl(pictureMatch[1]);
      if (isValidImageUrl(url)) {
        ogImage = url;
        foundImages.push(ogImage);
      }
    }
  }

  return ogImage;
}

// Helper function to extract LinkedIn name
function extractLinkedInName(text: string, currentName: string, username: string): string {
  let ogTitle = currentName;

  if (!ogTitle || ogTitle === username) {
    const profileNameMatch = text.match(/"firstName":"([^"]+)"/);
    if (profileNameMatch && profileNameMatch[1].length > 0) {
      ogTitle = profileNameMatch[1];
      const lastNameMatch = text.match(/"lastName":"([^"]+)"/);
      if (lastNameMatch && lastNameMatch[1].length > 0) {
        ogTitle = `${ogTitle} ${lastNameMatch[1]}`;
      }
    }
  }
  
  if (!ogTitle || ogTitle === username) {
    const headlineMatch = text.match(/"headline":"([^"]+)"/);
    if (headlineMatch && headlineMatch[1].length > 0 && headlineMatch[1].length < 100) {
      const titleText = headlineMatch[1];
      const nameFromTitle = titleText.split(' at ')[0].split('|')[0].trim();
      if (nameFromTitle.length > 2 && nameFromTitle.length < 50) {
        ogTitle = nameFromTitle;
      }
    }
  }
  
  if (!ogTitle || ogTitle === username) {
    const nameMatch = text.match(/"name":"([^"]+)"/);
    if (nameMatch && nameMatch[1].length > 0) {
      ogTitle = nameMatch[1];
    }
  }

  return ogTitle;
}
