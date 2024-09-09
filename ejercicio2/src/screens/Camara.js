import React, {useState, useRef, useEffect} from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function Camara() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [showCamaraF, setShowCamaraF] = useState(false);

    const abrirCamaraF = () => {
        setShowCamaraF(true);
    };

    if (!cameraPermission || !mediaLibraryPermissionResponse) {
        // Permissions are still loading.
        return <View />
    }
  
    if (!cameraPermission.granted || mediaLibraryPermissionResponse.status !== 'granted') {
        // Permissions are not granted yet.
        return (
          <View style={styles.container}>
              <Text>Se necesitan permisos para acceder a la cámara y a la galería.</Text>
              <TouchableOpacity style={styles.button} onPress={() => {
                  requestCameraPermission();
                  requestMediaLibraryPermission();
              }} >
                  <Text style={styles.buttonText}>Dar Permisos</Text>
              </TouchableOpacity>
          </View>
        )
    }

    return (
        <View style={styles.container}>
            {showCamaraF && (
                <CameraView styles={styles.camera} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 15,
    },
    button: {
        padding: 10,
        height: 90,
        width: 110,
        backgroundColor: '#dadd51',
        alignItems: 'center',
        borderRadius: 10,
    },
    camera: {
        flex:1,
        width: '100%',
    },
});