export const DEFAULT_LINKZONE_URL = 'localhost:8080';

export const getLinkZoneUrl = (url) => {
  return `http://${url}/api/`;
};

export const linkZoneApiUrl = getLinkZoneUrl(DEFAULT_LINKZONE_URL);
