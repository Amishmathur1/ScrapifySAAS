export async function checkScrapingAllowed(html: string, url: string): Promise<{ allowed: boolean; reason?: string }> {
  // Check robots.txt
  try {
    const robotsUrl = new URL('/robots.txt', url).toString();
    const robotsResponse = await fetch(robotsUrl);
    const robotsText = await robotsResponse.text();
    
    if (robotsText.toLowerCase().includes('disallow: /')) {
      return { 
        allowed: false, 
        reason: 'This website explicitly disallows scraping in its robots.txt file.' 
      };
    }
  } catch (error) {
    console.error('Error checking robots.txt:', error);
  }

  // Check meta tags
  const noIndexMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i);
  const noFollowMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*nofollow[^"']*["'][^>]*>/i);
  
  if (noIndexMatch || noFollowMatch) {
    return { 
      allowed: false, 
      reason: 'This website uses meta tags to indicate that scraping is not allowed.' 
    };
  }

  // Check for common anti-bot measures
  const commonAntiBot = [
    'captcha',
    'cloudflare',
    'anti-bot',
    'antibot',
    'ddos-guard',
    'datadome'
  ];

  for (const term of commonAntiBot) {
    if (html.toLowerCase().includes(term)) {
      return { 
        allowed: false, 
        reason: 'This website appears to use anti-bot protection.' 
      };
    }
  }

  return { allowed: true };
} 