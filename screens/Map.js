import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import IconButton from '../components/UI/IconButton';

const Map = ({ navigation, route }) => {
  const initalLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initalLng,
  };

  const [selLoc, setSelLoc] = useState(initalLocation);

  const region = {
    latitude: initalLocation ? initalLocation.lat : 37.78,
    longitude: initalLocation ? initalLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectLocationHandler = (event) => {
    if (initalLocation) {
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelLoc({ lat: lat, lng: lng });
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selLoc) {
      Alert.alert(
        'No location Picked',
        'You have to pick a location (by tapping on the map) first!',
      );
      return;
    }

    navigation.navigate('AddPlace', {
      pickedLat: selLoc.lat,
      pickedLng: selLoc.lng,
    });
  }, [navigation, selLoc]);

  useLayoutEffect(() => {
    if (initalLocation) {
      return;
    }
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          color={tintColor}
          icon="save"
          size={24}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, initalLocation]);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selLoc && (
        <Marker
          title={'Picked Location'}
          coordinate={{
            latitude: selLoc.lat,
            longitude: selLoc.lng,
          }}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default Map;
