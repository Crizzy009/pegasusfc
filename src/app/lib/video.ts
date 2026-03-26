
export function getYoutubeEmbedUrl(url: string) {
  if (!url) return "";
  
  // Handle shorts
  if (url.includes("youtube.com/shorts/")) {
    return url.replace("youtube.com/shorts/", "youtube.com/embed/").split("?")[0];
  }
  
  // Handle youtu.be
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  
  // Handle regular watch?v=
  if (url.includes("youtube.com/watch?v=")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}`;
  }
  
  return url;
}

export function getFacebookEmbedUrl(url: string) {
  if (!url) return "";
  
  // Facebook requires encoded URL for its embed player
  const encodedUrl = encodeURIComponent(url);
  return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=0&width=560`;
}

export function getVideoEmbedUrl(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return getYoutubeEmbedUrl(url);
  }
  if (url.includes("facebook.com")) {
    return getFacebookEmbedUrl(url);
  }
  return url;
}
