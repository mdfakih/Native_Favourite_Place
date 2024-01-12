import React, { useState } from 'react';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import OutlineButton from '../UI/OutlineButton';

const ImagePicker = ({ onTakeImage }) => {
  const [img, setImg] = useState();
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();

  const verifyPermissions = async () => {
    if (cameraPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionres = await requestPermission();
      return permissionres.granted;
    }

    if (cameraPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insuffecient Permission',
        'You need to grant camera permission to use the app.',
      );
      return false;
    }

    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    setImg(image.uri);
    onTakeImage(image.uri);
  };

  let imagePreview = <Text>No image taken yet</Text>;

  if (img) {
    imagePreview = (
      <Image
        style={styles.image}
        source={{ uri: img }}
      />
    );
  }

  return (
    <View>
      <View style={styles.imgPreview}>{imagePreview}</View>
      <OutlineButton
        icon="camera"
        onPress={takeImageHandler}
      >
        Take Image
      </OutlineButton>
    </View>
  );
};

const styles = StyleSheet.create({
  imgPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImagePicker;
