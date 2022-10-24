import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlCoffeeStrores = (latlong, query, limit, auth) => {
  const respons = fetch(
    `https://api.foursquare.com/v3/places/search?ll=${latlong}&query=${query}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `${auth}`,
      },
    }
  );
  return respons;
};

const getListOfCoffeeStoresImages = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "Coffee stores",
    page: 1,
    perPage: 40,
    orientation: "landscape",
  });

  const unspalshResults = photos.response.results;

  return unspalshResults.map((res) => res.urls["small"]);
};

export const fetchCoffeeStores = async (
  latlong = "31.3547,34.3088",
  limit = 6
) => {
  const photos = await getListOfCoffeeStoresImages();
  const respons = await getUrlCoffeeStrores(
    latlong,
    "Coffee",
    limit,
    process.env.NEXT_PUBLIC_AUTHORIZATION
  );
  const data = await respons.json();
  return data.results.map((venue, index) => {
    return {
      id: venue.fsq_id,
      address:
        venue.location.address ||
        venue.location.region ||
        venue.location.country ||
        "",
      neighborhood:
        venue.location.formatted_address || venue.location.cross_street,
      name: venue.name,
      imgUrl: photos[index],
    };
  });
};
