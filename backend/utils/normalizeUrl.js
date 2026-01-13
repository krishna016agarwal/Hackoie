export const normalizeUrl = (url) => {
  // normalize
  url.hash = "";
  url.search = "";

  return url.toString().replace(/\/$/, "")


};
