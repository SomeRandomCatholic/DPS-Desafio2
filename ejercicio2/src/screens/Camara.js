import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [images, setImages] = useState([]);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  const setupCamera = async () => {
    await MediaLibrary.requestPermissionsAsync();
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === 'granted');
  };

  setupCamera();

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImages([...images, data.uri]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const saveAllPictures = async () => {
    try {
      for (const image of images) {
        await MediaLibrary.createAssetAsync(image);
      }
      alert('All pictures saved! 🎉');
      setImages([]);
    } catch (error) {
      console.log(error);
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flash}>
        <View style={styles.cameraControls}>
          <TouchableOpacity
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}
          >
            <Text style={styles.controlText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.on
                  : Camera.Constants.FlashMode.off
              )
            }
          >
            <Text style={styles.controlText}>{flash === Camera.Constants.FlashMode.off ? '⚡' : '💡'}</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <ScrollView style={styles.imageContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.cardText}>Photo {index + 1}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.controls}>
        <Button title="Take a picture" onPress={takePicture} />
        {images.length > 0 && <Button title="Save all pictures" onPress={saveAllPictures} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  controlText: {
    fontSize: 24,
  },
  imageContainer: {
    flex: 1,
  },
  card: {
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardText: {
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  controls: {
    padding: 20,
  },
});