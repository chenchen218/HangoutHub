// API service for fetching travel data from Google Places API
export interface TravelItem {
  id: string;
  title: string;
  image: string;
  rating?: number;
  tag?: string;
  category: string;
  description?: string;
  price?: number;
  location?: string;
  coordinates?: { lat: number; lng: number };
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}

// Your Google Places API key
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Google Places API endpoints
const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Fetch popular hotels from Google Places API
export const fetchPopularItems = async (): Promise<TravelItem[]> => {
  try {
    // Search for hotels in Aspen, CO
    const response = await fetch(
      `${GOOGLE_PLACES_BASE_URL}/textsearch/json?query=hotels%20in%20Aspen%2C%20CO&type=lodging&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    // Transform Google Places data to our TravelItem format
    const hotels = await Promise.all(
      data.results.slice(0, 5).map(async (place: any, index: number) => {
        // Get additional details for each place
        const details = await getPlaceDetails(place.place_id);

        return {
          id: place.place_id,
          title: place.name,
          image: place.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
            : `https://images.unsplash.com/photo-${getRandomHotelImage(index)}`,
          rating: place.rating || 4.0 + Math.random() * 0.5,
          category: "Hotels",
          description: `Beautiful accommodation in ${place.name}, Aspen. ${
            place.formatted_address
              ? `Located at ${place.formatted_address}`
              : ""
          }`,
          price: getPriceFromRating(place.rating),
          coordinates: place.geometry?.location
            ? {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }
            : undefined,
          address: place.formatted_address,
          phone: details?.formatted_phone_number,
          website: details?.website,
          openingHours: details?.opening_hours?.weekday_text?.[0]?.replace(
            "Monday: ",
            ""
          ),
        };
      })
    );

    return hotels;
  } catch (error) {
    console.error("Google Places API Error:", error);
    // Fallback to mock data if API fails
    return getMockPopularItems();
  }
};

export const fetchRecommendedItems = async (): Promise<TravelItem[]> => {
  try {
    const categories = [
      { type: "restaurant", query: "restaurants in Aspen, CO" },
      { type: "tourist_attraction", query: "tourist attractions in Aspen, CO" },
      { type: "amusement_park", query: "activities in Aspen, CO" },
    ];

    let allPlaces: TravelItem[] = [];

    for (const category of categories) {
      const response = await fetch(
        `${GOOGLE_PLACES_BASE_URL}/textsearch/json?query=${encodeURIComponent(
          category.query
        )}&type=${category.type}&key=${API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status === "OK") {
          const places = await Promise.all(
            data.results.slice(0, 4).map(async (place: any, index: number) => {
              const details = await getPlaceDetails(place.place_id);

              return {
                id: place.place_id,
                title: place.name,
                image: place.photos?.[0]?.photo_reference
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
                  : `https://images.unsplash.com/photo-${getRandomImageForCategory(
                      category.type,
                      index
                    )}`,
                tag: getTagForCategory(category.type),
                category: getCategoryFromAPI(category.type),
                description: `Experience the best of ${place.name} in Aspen. ${
                  place.formatted_address
                    ? `Located at ${place.formatted_address}`
                    : ""
                }`,
                price: getPriceForCategory(category.type),
                coordinates: place.geometry?.location
                  ? {
                      lat: place.geometry.location.lat,
                      lng: place.geometry.location.lng,
                    }
                  : undefined,
                address: place.formatted_address,
                phone: details?.formatted_phone_number,
                website: details?.website,
                openingHours:
                  details?.opening_hours?.weekday_text?.[0]?.replace(
                    "Monday: ",
                    ""
                  ),
              };
            })
          );

          allPlaces = [...allPlaces, ...places];
        }
      }
    }

    return allPlaces.slice(0, 13); // Limit to 13 items
  } catch (error) {
    console.error("Google Places API Error:", error);
    // Fallback to mock data if API fails
    return getMockRecommendedItems();
  }
};

// Get additional place details from Google Places API
const getPlaceDetails = async (placeId: string) => {
  try {
    const response = await fetch(
      `${GOOGLE_PLACES_BASE_URL}/details/json?place_id=${placeId}&fields=formatted_phone_number,website,opening_hours&key=${API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.result;
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
  return null;
};

// Helper functions
const getRandomHotelImage = (index: number): string => {
  const hotelImages = [
    "1506744038136-46273834b3fb",
    "1467269204594-9661b134dd2b",
    "1571896349842-33c89424de2d",
    "1566073771259-6a8506099945",
    "1551882547-ff40c63fe5fa",
  ];
  return hotelImages[index % hotelImages.length];
};

const getRandomImageForCategory = (category: string, index: number): string => {
  const images = {
    restaurant: [
      "1414235077428-338989a2e8c0",
      "1554118811-1e0d58224f24",
      "1517248135467-4c7edcad34c4",
    ],
    tourist_attraction: [
      "1500534314209-a25ddb2bd429",
      "1465101046530-73398c7f28ca",
      "1551632811-561732d1e306",
    ],
    amusement_park: [
      "1544551763-46a013bb70d5",
      "1522163182402-834f871fd851",
      "1544161512-6ae8d5c3b3b3",
    ],
  };
  const categoryImages =
    images[category as keyof typeof images] || images.tourist_attraction;
  return categoryImages[index % categoryImages.length];
};

const getTagForCategory = (category: string): string => {
  const tags = {
    restaurant: "Dining",
    tourist_attraction: "Must See",
    amusement_park: "2H",
  };
  return tags[category as keyof typeof tags] || "Experience";
};

const getCategoryFromAPI = (category: string): string => {
  const categories = {
    restaurant: "Food",
    tourist_attraction: "Adventure",
    amusement_park: "Activities",
  };
  return categories[category as keyof typeof categories] || "Experience";
};

const getPriceForCategory = (category: string): number => {
  const prices = {
    restaurant: 50 + Math.random() * 100,
    tourist_attraction: 100 + Math.random() * 200,
    amusement_park: 75 + Math.random() * 150,
  };
  return Math.round(prices[category as keyof typeof prices] || 100);
};

const getPriceFromRating = (rating?: number): number => {
  if (!rating) return 200 + Math.random() * 400;
  // Higher rating = higher price
  return Math.round(150 + rating * 100 + Math.random() * 100);
};

// Fallback mock data functions
const getMockPopularItems = (): TravelItem[] => [
  {
    id: "1",
    title: "Alley Palace",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    rating: 4.1,
    category: "Hotels",
    description: "A beautiful riverside palace with stunning views.",
    price: 299,
  },
  {
    id: "2",
    title: "Coeurdes Alpes",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
    rating: 4.5,
    category: "Hotels",
    description: "A charming alpine town with picturesque streets.",
    price: 399,
  },
  {
    id: "3",
    title: "Mountain View Lodge",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    rating: 4.3,
    category: "Hotels",
    description: "Cozy lodge with panoramic mountain views.",
    price: 249,
  },
  {
    id: "4",
    title: "Aspen Grand Hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.7,
    category: "Hotels",
    description: "Luxury hotel in the heart of Aspen.",
    price: 599,
  },
  {
    id: "5",
    title: "Ski Resort Inn",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    rating: 4.2,
    category: "Hotels",
    description: "Perfect for ski enthusiasts.",
    price: 199,
  },
];

const getMockRecommendedItems = (): TravelItem[] => [
  {
    id: "6",
    title: "Explore Aspen",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    tag: "2N/3D",
    category: "Adventure",
    description: "Discover the beauty of Aspen with this exclusive package.",
    price: 899,
  },
  {
    id: "7",
    title: "Luxurious Aspen",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    tag: "2N/3D",
    category: "Adventure",
    description: "Experience luxury in Aspen with premium amenities.",
    price: 1299,
  },
  {
    id: "8",
    title: "Mountain Hiking",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    tag: "1D",
    category: "Adventure",
    description: "Guided hiking tour through scenic mountain trails.",
    price: 149,
  },
  {
    id: "9",
    title: "Ski Adventure",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    tag: "3D",
    category: "Adventure",
    description: "Comprehensive ski package with equipment and lessons.",
    price: 599,
  },
  {
    id: "10",
    title: "Rock Climbing",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851",
    tag: "1D",
    category: "Adventure",
    description: "Expert-guided rock climbing experience.",
    price: 199,
  },
  {
    id: "11",
    title: "Fine Dining",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    tag: "Dinner",
    category: "Food",
    description: "Gourmet dining experience with local ingredients.",
    price: 89,
  },
  {
    id: "12",
    title: "Local Cafe",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    tag: "Breakfast",
    category: "Food",
    description: "Cozy cafe serving fresh local breakfast.",
    price: 25,
  },
  {
    id: "13",
    title: "Mountain Restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    tag: "Lunch",
    category: "Food",
    description: "Scenic mountain restaurant with panoramic views.",
    price: 45,
  },
  {
    id: "14",
    title: "Wine Tasting",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
    tag: "Evening",
    category: "Food",
    description: "Premium wine tasting experience.",
    price: 75,
  },
  {
    id: "15",
    title: "Spa Treatment",
    image: "https://images.unsplash.com/photo-1544161512-6ae8d5c3b3b3",
    tag: "2H",
    category: "Activities",
    description: "Relaxing spa treatment with mountain views.",
    price: 199,
  },
  {
    id: "16",
    title: "Yoga Session",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    tag: "1H",
    category: "Activities",
    description: "Peaceful yoga session in nature.",
    price: 49,
  },
  {
    id: "17",
    title: "Photography Tour",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    tag: "3H",
    category: "Activities",
    description: "Professional photography tour of scenic spots.",
    price: 129,
  },
  {
    id: "18",
    title: "Shopping District",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    tag: "2H",
    category: "Activities",
    description: "Guided tour of local shopping districts.",
    price: 39,
  },
];

// Google Places API helper functions
export const searchNearbyPlaces = async (
  latitude: number,
  longitude: number,
  radius: number = 5000,
  type?: string
) => {
  try {
    const url = `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}${
      type ? `&type=${type}` : ""
    }&key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Google Places Nearby Search Error:", error);
    throw error;
  }
};

export const getPlaceAutocomplete = async (
  input: string,
  sessionToken?: string
) => {
  try {
    const url = `${GOOGLE_PLACES_BASE_URL}/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=establishment&key=${API_KEY}${
      sessionToken ? `&sessiontoken=${sessionToken}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Google Places Autocomplete Error:", error);
    throw error;
  }
};
