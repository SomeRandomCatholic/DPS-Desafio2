import React, {useState, useRef, useEffect} from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';
import { Video, ResizeMode} from 'expo-av';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Multimedia() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
    const [showCamaraF, setShowCamaraF] = useState(false);
    const [showCamaraV, setShowCamaraV] = useState(false);
    const [cameraProps, setCameraProps] = useState({
        facing: 'front',
        mode: 'picture',
    });
    const cameraRef = useRef(null);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [descripcion, setDescripcion] = useState(null);
    const [archivos, setArchivos] = useState([]);

    //función para obtener listado de archivos, que se actualiza cada vez que se guarda un nuevo archivo
    useEffect(() => {
        const obtenerArchivosStorage = async () => {
            try {
                const archivosStorage = await AsyncStorage.getItem('archivos');
                if(archivosStorage) {
                    setArchivos(JSON.parse(archivosStorage))
                }
            } catch (error) {
                console.log(error);
            }
        }
        obtenerArchivosStorage();
    }, [archivos]);

    //función para abrir cámara para tomar fotos
    const abrirCamaraF = () => {
        setShowCamaraF(true);
        setMode('mode','picture');
    };

    //función para cerrar cámara
    const cerrarCamaraF = () => {
        setShowCamaraF(false);
    };

    //función para abrir cámara para grabar videos
    const abrirCamaraV = () => {
        setShowCamaraV(true);
        setMode('mode','video');
    };

    //función para cerrar cámara
    const cerrarCamaraV = () => {
        setShowCamaraV(false);
    };
    
    //función que retorna vista cuando permisos se están cargando
    if (!cameraPermission || !mediaLibraryPermissionResponse || !audioPermission) {
        return <View />
    }
  
    //pedir permisos si no han sido concedidos
    if (!cameraPermission.granted || mediaLibraryPermissionResponse.status !== 'granted' || !audioPermission.granted) {
        return (
            <View style={styles.container}>
                <Text>Se necesitan permisos para acceder a la cámara</Text>
                <TouchableOpacity style={styles.button} onPress={() => {
                    requestCameraPermission();
                    requestMediaLibraryPermission();
                    requestAudioPermission();
                }} >
                    <Text style={styles.buttonText}>Dar Permisos</Text>
                </TouchableOpacity>
            </View>
        )
    }

    //función para cambiar cámara frontal o trasera
    const toggleProperty = (prop, option1, option2) => {
        setCameraProps((current) => ({
            ...current,
            [prop]:current[prop] === option1 ? option2 : option1
        }));
    };

    //función para establecer si la cámara toma foto o video
    const setMode = (prop, option) => {
        setCameraProps((current) => ({
            ...current,
            [prop]: option
        }));
    };

    //función para tomar foto
    const takePicture = async() => {
        if(cameraRef.current) {
            try {
                const picture = await cameraRef.current.takePictureAsync();
                setImage(picture.uri);
            } catch (err) {
                console.log('Error while taking the picture : ', err);
            }
        }
    }

    //función para guardar foto
    const savePicture = async() => {
        if(image) {
            try {
                const asset = await MediaLibrary.createAssetAsync(image);
                //permisos para geolocalización
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    <Text style={styles.textwarning}>Se necesitan permisos para acceder a la ubicación.</Text>
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                let ubicacion = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                const archivo = { descripcion };
                //se crea un id para el nuevo archivo utilizando la fecha
                archivo.id = Date.now().toString(36)
                //tipo 1 porque es fotografía
                archivo.tipo = 1;
                archivo.uri = image;
                //ubicación solo guarda la ciudad y país obtenido de la geolocalización reversa
                archivo.ubicacion = ubicacion[0].city + ", " + ubicacion[0].country;
                const archivosNuevo = [...archivos, archivo];
                setArchivos(archivosNuevo);
                guardarArchivos(JSON.stringify(archivosNuevo));
                Alert.alert("Fotografía guardada");
                setImage(null);
            } catch (err) {
                console.log('Error while saving the picture : ', err);
            }
        }
    }

    //función para descartar fotografía tomada
    const noSavePicture = async() => {
        if(image) {
            try {
                setImage(null);
            } catch (err) {
                console.log('Error: ', err);
            }
        }
    }

    //función para empezar grabación de video
    const recordVideo = async () => {
        if (cameraRef.current && !isRecording) {
            try {
                setIsRecording(true);
                const video = await cameraRef.current.recordAsync();
                setIsRecording(false);
                setVideo(video.uri);
            } catch (error) {
                console.error('Error recording video:', error);
            }
        }
    };

    //función para detener grabación de video
    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
        }
    };

    //función para guardar video
    const saveVideo = async() => {
        if(video) {
            try {
                const asset = await MediaLibrary.createAssetAsync(video);
                //permisos para geolocalización
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    <Text style={styles.textwarning}>Se necesitan permisos para acceder a la ubicación.</Text>
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                let ubicacion = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                const archivo = { descripcion };
                //se crea un id para el nuevo archivo utilizando la fecha
                archivo.id = Date.now().toString(36)
                //tipo 2 porque es video
                archivo.tipo = 2;
                archivo.uri = video;
                //ubicación solo guarda la ciudad y país obtenido de la geolocalización reversa
                archivo.ubicacion = ubicacion[0].city + ", " + ubicacion[0].country;
                const archivosNuevo = [...archivos, archivo];
                setArchivos(archivosNuevo);
                guardarArchivos(JSON.stringify(archivosNuevo));
                Alert.alert("Video guardado");
                setVideo(null);
            } catch (err) {
                console.log('Error while saving the video : ', err);
            }
        }
    }

    //función para descartar video tomado
    const noSaveVideo = async() => {
        if(video) {
            try {
                setVideo(null);
            } catch (err) {
                console.log('Error: ', err);
            }
        }
    }

    //función para guardar archivos en async storage
    const guardarArchivos = async (archivosJSON) => {
        try {
            await AsyncStorage.setItem('archivos', archivosJSON);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {(!image && !video) && ( //si no hay foto o video tomado
                <>
                    {showCamaraF && ( //si se selecciona cámara para tomar foto
                        <View style={styles.containerCamara}>
                            <CameraView
                                style={styles.camera}
                                facing={cameraProps.facing}
                                ref={cameraRef}
                            />
                            <View style={styles.ControlsContainer}>
                                <Button 
                                    icon='cycle'
                                    onPress={() => toggleProperty('facing', 'front', 'back')}
                                />
                                <Button
                                    icon='controller-record'
                                    size={60}
                                    style={{height:60}}
                                    onPress={takePicture}
                                />
                                <Button 
                                    icon='level-up'
                                    size={60}
                                    style={{height:60}}
                                    onPress={cerrarCamaraF}
                                />
                            </View>
                        </View>
                    )}
                    {showCamaraV && ( //si se selecciona cámara para grabar video
                        <View style={styles.containerCamara}>
                            <CameraView
                                style={styles.camera}
                                facing={cameraProps.facing}
                                ref={cameraRef}
                                mode={cameraProps.mode}
                            />
                            <View style={styles.ControlsContainer}>
                                {!isRecording && ( //si no se está grabando muestra botón para cambiar cámara frontal o trasera
                                    <Button
                                        icon='cycle'
                                        onPress={() => toggleProperty('facing', 'front', 'back')}
                                    />
                                )}
                                {!isRecording && ( //si no se está grabando muestra botón para comenzar a grabar
                                    <Button 
                                        icon='controller-record'
                                        style={{height:60}}
                                        onPress={recordVideo}
                                    />
                                )}
                                {isRecording && ( //si se está grabando muestra botón para detener grabación
                                    <Button
                                        icon='controller-stop'
                                        style={{height:60}}
                                        onPress={stopRecording}
                                    />
                                )}
                                {!isRecording && ( //si no se está grabando muestra botón para regresar a menú de cámaras
                                    <Button 
                                        icon='level-up'
                                        style={{height:60}}
                                        onPress={cerrarCamaraV}
                                    />
                                )}
                            </View>
                        </View>
                    )}
                    {!showCamaraF && !showCamaraV && ( //si ninguna cámara está activa, muestra menú de cámaras
                        <View style={styles.container}>
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.button} onPress={abrirCamaraF}>
                                    <Icon name="camera" size={50} color="black" />
                                    <Text style={styles.buttonText}>Fotografía</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={abrirCamaraV}>
                                    <Icon name="video-camera" size={50} color="black" />
                                    <Text style={styles.buttonText}>Video</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </>
            )}
            {image &&( //si hay foto tomada, muestra vista previa para guardar foto
                <>
                    <Image source={{uri:image}} style={styles.camera}/>
                    <View style={styles.ControlsContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="  Añadir Descripción"
                            onChangeText={setDescripcion}
                        />
                        <Button 
                          icon='check'
                          color='green'
                          onPress={savePicture}
                        />
                        <Button 
                          icon='trash'
                          color='red'
                          onPress={noSavePicture}
                        />
                    </View>
                </>
            )}
            {video &&( //si hay video grabado, muestra vista previa para guardar video
                <>
                    <Video style={styles.camera} source={{uri:video}} useNativeControls resizeMode={ResizeMode.CONTAIN}/>
                    <View style={styles.ControlsContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="  Añadir Descripción"
                            onChangeText={setDescripcion}
                        />
                        <Button 
                            icon='check'
                            color='green'
                            onPress={saveVideo}
                        />
                        <Button 
                            icon='trash'
                            color='red'
                            onPress={noSaveVideo}
                        />
                    </View>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    containerCamara: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        width: '100%',
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
        height: '100%',
    },
    ControlsContainer: {
        height: 70,
        width:'100%',
        backgroundColor:'black',
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
    },
    input: {
        marginTop: 0,
        height: 50,
        width: '60%',
        borderColor: '#e1e1e1',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#e1e1e1',
        marginLeft: 10,
    },
});