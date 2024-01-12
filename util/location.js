export const getMapPreview = (lat, lng) => {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=400x200&maptype=roadmap
    &markers=color:red%7Clabel:S%7C${lat},${lng}
    &key=AIzaSyBvip_enJOfJBaG2bp5T6Uo7_kaPgSllf0`;

  return imagePreviewUrl;
};

export const getAddress = async (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBvip_enJOfJBaG2bp5T6Uo7_kaPgSllf0`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to get Address!');
  }

  const data = await res.json();
  const address = data.results[0].formatted_address;
  return address;
};
