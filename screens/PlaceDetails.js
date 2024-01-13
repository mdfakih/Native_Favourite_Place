import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import OutlineButton from '../components/UI/OutlineButton';
import { Colors } from '../constants/colors';
import { fetchPlaceDetails } from '../util/database';

const PlaceDetails = ({ route, navigation }) => {
  const selectedPlaceId = route.params.placeId;

  const [fetchedPlace, setFetchedPlace] = useState();

  useEffect(() => {
    const loadPlaceData = async () => {
      const place = await fetchPlaceDetails(selectedPlaceId);
      setFetchedPlace(place);
      navigation.setOptions({
        title: place.title,
        headerTitleAlign: 'center',
      });
    };
    loadPlaceData();
  }, [selectedPlaceId]);

  const showOnMapHandler = () => {
    navigation.navigate('Map', {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  };

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data..</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image
        style={styles.image}
        source={{ uri: fetchedPlace.imageUri }}
      />
      <View style={styles.locationCnt}>
        <View style={styles.addressCnt}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlineButton
          icon="map"
          onPress={showOnMapHandler}
        >
          View on Map
        </OutlineButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
  },
  locationCnt: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCnt: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlaceDetails;
