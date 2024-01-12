import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';
import ImagePicker from './ImagePicker';
import LocationPicker from './LocationPicker';
import Button from '../UI/Button';
import { Place } from '../../models/place';

const PlaceForm = ({ onCreatePlace }) => {
  const [title, setTitle] = useState('');
  const [selectedImg, setSelectedImg] = useState();
  const [pickedLoc, setPickedLoc] = useState();

  const changeTitleHandler = (enteredText) => setTitle(enteredText);

  const takeImagehandler = (imageUri) => {
    setSelectedImg(imageUri);
  };

  const locationPickHandler = useCallback((location) => {
    setPickedLoc(location);
  }, []);

  const savePlaceHandler = () => {
    const placeData = new Place(title, selectedImg, pickedLoc);
    onCreatePlace(placeData);
  };

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Titile</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={title}
        />
      </View>
      <ImagePicker onTakeImage={takeImagehandler} />
      <LocationPicker onPickLocation={locationPickHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
});

export default PlaceForm;
