import axios from '../axios';

export const getAllHotels = (searchData) => {
  const {
    city,
    searchTerm,
    startDate,
    endDate,
    guest,
    latitude,
    longitude,
    filterData,
    sortBy,
    sortOrder,
    page,
    pageSize,
  } = searchData || {};

  const { price, rating, amenities } = filterData || {};

  return axios.get(
    '/public/hotel/getAllHotels',

    {
      params: {
        search: searchTerm ? searchTerm : null || city ? city : null,
        longitude: longitude ? longitude : null,
        latitude: latitude ? latitude : null,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
        guest: guest ? guest : null,
        price: price ? price : null,
        rating: rating ? rating : null,
        amenity: amenities ? amenities : null,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
        page,
        pageSize,
      },
    }
  );
};

export const getHotelById = (id) => {
  return axios.get(`/public/hotel/getHotelById/${id}`);
};

export const getAllHotelRoomCategory = () => {
  return axios.get('/public/hotel/getAllRoomCategory');
};

// Hotel city data apis

export const getAllCities = () => {
  return axios.get('/public/hotel/getAllCities');
};

export const getHotelsByCity = ({ city, page, pageSize }) => {
  return axios.get(`/public/hotel/getHotelsByCity/${city}`, {
    params: {
      page,
      pageSize,
    },
  });
};

// Hotel amenities data apis

export const getAllAmenities = () => {
  return axios.get('/public/hotel/getAllHotelAmenities');
};

//get top rated hotels
export const getAllTopRated = () => {
  return axios.get('/public/hotel/topratedHotels');
};

// get trending hotels
export const getTrendingHotels = () => {
  return axios.get('/public/hotel/trendingHotels');
};

//get latest hotels
export const getLatestHotels = () => {
  return axios.get('/public/hotel/latestHotels');
};
