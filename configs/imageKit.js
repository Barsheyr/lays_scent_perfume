import ImageKit from "imagekit";

// Created on first use (not at import time), so a missing key can't
// break `next build` — it only errors when an image is actually uploaded.
let client;

function getClient() {
  if (!client) {
    const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
      process.env;
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
      throw new Error(
        "ImageKit keys are missing: set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT"
      );
    }
    client = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
  }
  return client;
}

const imagekit = {
  upload: (...args) => getClient().upload(...args),
  url: (...args) => getClient().url(...args),
};

export default imagekit;
