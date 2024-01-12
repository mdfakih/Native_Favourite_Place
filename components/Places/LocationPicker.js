import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import OutlineButton from '../UI/OutlineButton';
import { Colors } from '../../constants/colors';
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';
import { getAddress, getMapPreview } from '../../util/location';

const LocationPicker = ({ onPickLocation }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const [pickedLoc, setPickedLoc] = useState();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = route.params && {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };

      setPickedLoc(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    const handleLoc = async () => {
      if (pickedLoc) {
        const address = await getAddress(pickedLoc.lat, pickedLoc.lng);
        onPickLocation({ ...pickedLoc, address: address });
      }
    };
    handleLoc();
  }, [pickedLoc, onPickLocation]);

  const [locationPermissionInfo, requestPermission] =
    useForegroundPermissions();

  const verifyPermissions = async () => {
    if (locationPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionres = await requestPermission();
      return permissionres.granted;
    }

    if (locationPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insuffecient Permission',
        'You need to grant location permission to use this app.',
      );
      return false;
    }

    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const loc = await getCurrentPositionAsync();
    setPickedLoc({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });
  };

  const pickOnMapHandler = () => navigation.navigate('Map');

  let locPreview = <Text>No Location picked yet</Text>;

  if (pickedLoc) {
    locPreview = (
      <Image
        style={styles.mapImg}
        source={{ uri: getMapPreview(pickedLoc.lat, pickedLoc.lng) }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locPreview}</View>
      <View style={styles.actions}>
        <OutlineButton
          icon="location"
          onPress={getLocationHandler}
        >
          Locate User
        </OutlineButton>
        <OutlineButton
          icon="map"
          onPress={pickOnMapHandler}
        >
          Pick on Map
        </OutlineButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mapImg: {
    width: '100%',
    height: '100%',
    // borderRadius: 4,
  },
});

export default LocationPicker;
