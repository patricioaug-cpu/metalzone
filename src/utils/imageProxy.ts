/**
 * Image proxy and optimizer utility.
 * Helps bypass hotlinking blocks (e.g., from Wikipedia/Wikimedia Commons)
 * and optimizes image sizes/formats using images.weserv.nl.
 */
export const getProxiedImageUrl = (url: string, width = 600): string => {
  if (!url) return "";
  
  // Return immediately for data URIs or already proxied URLs
  if (url.startsWith("data:") || url.includes("images.weserv.nl")) {
    return url;
  }
  
  // Return immediately for local assets
  if (url.startsWith("/") || url.startsWith("http://localhost") || url.startsWith("https://localhost")) {
    return url;
  }
  
  // If it's an Unsplash URL, it's already CDN-optimized and doesn't block hotlinking
  if (url.includes("images.unsplash.com")) {
    if (url.includes("w=") && width) {
      return url.replace(/w=\d+/, `w=${width}`);
    }
    return url;
  }
  
  // Clean prefix to make weserv URL clean and encode it safely
  const cleanUrl = url.replace(/^https?:\/\//, "");
  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=80`;
};
