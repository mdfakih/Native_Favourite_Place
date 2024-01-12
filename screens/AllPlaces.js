import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import PlacesList from '../components/Places/PlacesList';
import { fetchPlaces } from '../util/database';

const AllPlaces = ({ route }) => {
  const isFocused = useIsFocused();
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  useEffect(() => {
    const loadplaces = async () => {
      const places = await fetchPlaces();
      setLoadedPlaces(places);
    };
    if (isFocused) {
      loadplaces();
      // setLoadedPlaces((prev) => [...prev, route.params.place]);
    }
  }, [isFocused]);

  return <PlacesList places={loadedPlaces} />;
};

export default AllPlaces;
