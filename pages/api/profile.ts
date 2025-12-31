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

function cleanUrl(url: string): string {
  if (!url) return '';
  // Remove backslash escapes
  url = url.replace(/\\/g, '');
  // Decode HTML entities and URL encoding
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    // Continue if decode fails
  }
  // Ensure it's an absolute URL
  if (!url.startsWith('http')) {
    if (url.startsWith('//')) {
      url = 'https:' + url;
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

    for (const target of targets) {
      try {
        const r = await fetch(target.url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'max-age=0',
            'Pragma': 'no-cache',
            'Referer': 'https://www.google.com/',
          },
          // Set shorter timeout for faster failure
          signal: AbortSignal.timeout(10000),
        });

        statusCode = r.status;

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
          
          if (metaImage) ogImage = metaImage;

          // For Instagram - try to extract profile picture from various sources
          if (platform === 'instagram' && !ogImage) {
            // Try profile_pic_url_hd first (higher resolution)
            let profilePicMatch = text.match(/"profile_pic_url_hd":"([^"]+)"/);
            if (profilePicMatch) {
              ogImage = cleanUrl(profilePicMatch[1]);
            }

            // Try profile_pic_url from shared data (most common)
            if (!ogImage) {
              profilePicMatch = text.match(/"profile_pic_url":"([^"]+)"/);
              if (profilePicMatch) {
                ogImage = cleanUrl(profilePicMatch[1]);
              }
            }

            // Try hdProfilePicUrlInfo
            if (!ogImage) {
              const hdPicMatch = text.match(/"hdProfilePicUrlInfo":\s*\{\s*"url":"([^"]+)"/);
              if (hdPicMatch) {
                ogImage = cleanUrl(hdPicMatch[1]);
              }
            }

            // Try user.profile_pic_url pattern
            if (!ogImage) {
              profilePicMatch = text.match(/"user":\s*\{[^}]*"profile_pic_url":"([^"]+)"/);
              if (profilePicMatch) {
                ogImage = cleanUrl(profilePicMatch[1]);
              }
            }

            // Try profilePic or profile_image fields
            if (!ogImage) {
              const altPicMatch = text.match(/"(?:profilePic|profile_image)":"([^"]+)"/);
              if (altPicMatch) {
                ogImage = cleanUrl(altPicMatch[1]);
              }
            }

            // Try image from JSON responses embedded in HTML
            if (!ogImage) {
              const imageMatch = text.match(/"image":"([^"]*(?:cdninstagram|instagram)[^"]*)"/i);
              if (imageMatch) {
                ogImage = cleanUrl(imageMatch[1]);
              }
            }

            // Extract name from Instagram data (try multiple patterns)
            if (!ogTitle || ogTitle === username) {
              // Primary: full_name field
              let fullNameMatch = text.match(/"full_name":"([^"]+)"/);
              if (fullNameMatch && fullNameMatch[1].length > 0) {
                ogTitle = fullNameMatch[1];
              }
              
              // Secondary: biography or description might contain name
              if (!ogTitle || ogTitle === username) {
                const bioMatch = text.match(/"biography":"([^"]+)"/);
                if (bioMatch && bioMatch[1].length > 2) {
                  // Extract first line or first sentence as potential name
                  const firstLine = bioMatch[1].split('\n')[0];
                  if (firstLine.length > 2 && firstLine.length < 50) {
                    ogTitle = firstLine;
                  }
                }
              }
              
              // Tertiary: Try owner field
              if (!ogTitle || ogTitle === username) {
                const ownerMatch = text.match(/"owner":\s*\{\s*"username":"([^"]+)"/);
                if (ownerMatch) {
                  ogTitle = ownerMatch[1];
                }
              }
            }
          }

          // For LinkedIn - try multiple image extraction methods
          if (platform === 'linkedin' && !ogImage) {
            // Try profilePicture from various patterns
            let linkedinImageMatch = text.match(/"profilePicture":\s*\{\s*"displayImage":"([^"]+)"/);
            if (linkedinImageMatch) {
              ogImage = cleanUrl(linkedinImageMatch[1]);
            }

            // Try displayImage pattern with urn: prefix
            if (!ogImage) {
              linkedinImageMatch = text.match(/"displayImage":"(urn:[^"]+)"/);
              if (linkedinImageMatch) {
                // LinkedIn URNs need special handling - convert to image URL if possible
                ogImage = linkedinImageMatch[1];
              }
            }

            // Try direct image URL patterns
            if (!ogImage) {
              const directImageMatch = text.match(/"image":"(https:[^"]*(?:linkedin|akamai|media-exp)[^"]*)"/);
              if (directImageMatch) {
                ogImage = cleanUrl(directImageMatch[1]);
              }
            }

            // Try avatar/profile photo patterns
            if (!ogImage) {
              const avatarMatch = text.match(/"(?:avatar|profilePhoto|picture|profileImage)":"(https:[^"]+)"/i);
              if (avatarMatch) {
                ogImage = cleanUrl(avatarMatch[1]);
              }
            }

            // Try image property directly
            if (!ogImage) {
              const imgMatch = text.match(/<img[^>]*src="([^"]*(?:linkedin|media-exp|platform-lookaside|lcdn)[^"]*)"[^>]*(?:alt|title)="[^"]*(?:profile|avatar|photo)/i);
              if (imgMatch) {
                ogImage = cleanUrl(imgMatch[1]);
              }
            }

            // Try profileURL field for image
            if (!ogImage) {
              const profileUrlMatch = text.match(/"profileURL":"([^"]+)"/);
              if (profileUrlMatch) {
                // Extract image from URL if it contains images
                ogImage = cleanUrl(profileUrlMatch[1]);
              }
            }

            // Extract name from LinkedIn data (try multiple patterns)
            if (!ogTitle || ogTitle === username) {
              // Primary: firstName + lastName
              let profileNameMatch = text.match(/"firstName":"([^"]+)"/);
              if (profileNameMatch && profileNameMatch[1].length > 0) {
                ogTitle = profileNameMatch[1];
                // Try to add last name
                const lastNameMatch = text.match(/"lastName":"([^"]+)"/);
                if (lastNameMatch && lastNameMatch[1].length > 0) {
                  ogTitle = `${ogTitle} ${lastNameMatch[1]}`;
                }
              }
              
              // Secondary: Try headline or title field (professional title like "Software Engineer")
              if (!ogTitle || ogTitle === username) {
                const headlineMatch = text.match(/"headline":"([^"]+)"/);
                if (headlineMatch && headlineMatch[1].length > 0 && headlineMatch[1].length < 100) {
                  // This might contain the name
                  const titleText = headlineMatch[1];
                  // Extract just the name part if it contains parentheses or special formatting
                  const nameFromTitle = titleText.split(' at ')[0].split('|')[0].trim();
                  if (nameFromTitle.length > 2 && nameFromTitle.length < 50) {
                    ogTitle = nameFromTitle;
                  }
                }
              }
              
              // Tertiary: Try from name field directly
              if (!ogTitle || ogTitle === username) {
                const nameMatch = text.match(/"name":"([^"]+)"/);
                if (nameMatch && nameMatch[1].length > 0) {
                  ogTitle = nameMatch[1];
                }
              }
            }
          }

          // Also try extracting from JSON-LD structured data
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
                      if (jsonld.image && !ogImage) {
                        ogImage = typeof jsonld.image === 'string' ? jsonld.image : jsonld.image.url;
                      }
                      break;
                    }
                    if (jsonld.author?.name && !ogTitle) {
                      ogTitle = jsonld.author.name;
                    }
                    if (jsonld.image && !ogImage) {
                      ogImage = typeof jsonld.image === 'string' ? jsonld.image : jsonld.image.url;
                    }
                  }
                } catch (e) {
                  // Continue to next JSON-LD block
                }
              }
            }
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
  } catch (err: any) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch profile. Please try again.' });
  }
}
