export const imageURL = (image) => {
  return image && image.path
    ? `${process.env.PRODUCT_CDN_URL}${image.path}`
    : null;
};
export const imageURLDecode = (url) => {
  return url?.split(process.env.PRODUCT_CDN_URL)[1];
};

export const imageURLs = (images) => {
  console.log('images', images);
  return images.map((image) => {
    return {
      original:
        image && image.path
          ? `${process.env.PRODUCT_CDN_URL}${image.path}`
          : null,
      thumbnail:
        image && image.path
          ? `${process.env.PRODUCT_CDN_URL}${image.path}`
          : null,
      defaultImage: image.defaultimage,
      priority: image.priority,
      uuid: image.uuid,
    };
  });
};
