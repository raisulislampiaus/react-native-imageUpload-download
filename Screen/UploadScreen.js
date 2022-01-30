//import liraries
import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {api} from '../constants';
import {androidCameraPermission} from '../permissions';
import axios from 'axios';
import codePush from 'react-native-code-push';

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

const UploadScreen = () => {
  useEffect(() => {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  }, []);

  const onSelectImage = async () => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus || Platform.OS == 'ios') {
      Alert.alert('Profile Picture', 'Choose an option', [
        {text: 'Camera', onPress: onCamera},
        {text: 'Gallery', onPress: onGallery},
        {text: 'Cancel', onPress: () => {}},
      ]);
    }
  };

  const onCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
    });
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log('selected Image', image);
      imageUpload(image.path);
    });
  };

  const imageUpload = imagePath => {
    const imageData = new FormData();
    imageData.append('image', {
      uri: imagePath,
      name: 'image.png',
      fileName: 'image',
      type: 'image/png',
    });
    console.log('form data', imageData);
    axios({
      method: 'post',
      url: api,
      data: imageData,
    })
      .then(function (response) {
        console.log('image upload successfully', response.data);
      })
      .then(error => {
        console.log('error riased', error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnStyle}
        activeOpacity={0.8}
        onPress={onSelectImage}>
        <Text style={styles.textStyle}>select your image</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    backgroundColor: 'blue',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
});

//make this component available to the app
export default codePush(codePushOptions)(UploadScreen);
