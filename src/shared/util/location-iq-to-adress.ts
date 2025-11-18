export default (data: any) => {
  const {
    lat,
    lon,
    address: {
      road: address,
      suburb: neighborhood,
      state,
      city,
      town,
      village,
      country,
    },
  } = data;

  return {
    address,
    neighborhood,
    state,
    city: city ?? town ?? village,
    country,
    addressLat: lat,
    addressLng: lon,
  };
};
