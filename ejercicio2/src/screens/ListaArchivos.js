import React, {useState, useCallback} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import Button from './Button';
import { Video, ResizeMode} from 'expo-av';

export default function ListaArchivos() {
    const [archivos, setArchivos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [nuevaDescripcion, setNuevaDescripcion] = useState(null);
    const [modificar, setModificar] = useState(false);
    const [eliminar, setEliminar] = useState(false);

    useFocusEffect(
        useCallback(() => {
          const obtenerDatos = async () => {
            try {
              const datos = await AsyncStorage.getItem('archivos');
              if (datos) {
                setArchivos(JSON.parse(datos))
              }
            } catch (error) {
              console.log('Error al obtener los datos', error);
            }
          };
    
          obtenerDatos();
        }, [])
    );

    const abrirModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
        setModificar(true);
    };

    const abrirModalE = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
        setEliminar(true);
    };

    const actualizarDescripcion = async () => {
        selectedItem.descripcion = nuevaDescripcion;
        try {
            // Obtener todos los items guardados en AsyncStorage
            const itemsStorage = await AsyncStorage.getItem('archivos');
            const items = itemsStorage ? JSON.parse(itemsStorage) : [];
    
            // Actualizar el item específico en la lista
            const updatedItems = items.map(item =>
                item.id === selectedItem.id ? selectedItem : item
            );
    
            // Guardar la lista actualizada en AsyncStorage
            await AsyncStorage.setItem('archivos', JSON.stringify(updatedItems));
        } catch (error) {
            console.log('Error al guardar en AsyncStorage', error);
        }
        console.log(selectedItem);
        setModalVisible(false);
        setModificar(false);
    };

    const eliminarArchivo = async () => {
        try {
            const itemsStorage = await AsyncStorage.getItem('archivos');
            const items = itemsStorage ? JSON.parse(itemsStorage) : [];
    
            const updatedItems = items.filter(item => item.id !== selectedItem.id);
    
            await AsyncStorage.setItem('archivos', JSON.stringify(updatedItems));
            setArchivos(updatedItems);
            setSelectedItem(null);
    
        } catch (error) {
            console.log('Error al eliminar el item', error);
        }
        setModalVisible(false);
        setEliminar(false);
    };

    return (
        <View style={styles.container}>
            {selectedItem && modificar && (<Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setModificar(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Modifica la descripción del archivo:</Text>
                        <TextInput
                            style={styles.input} placeholder="  Añadir Descripción"
                            onChangeText={setNuevaDescripcion}
                        />
                        <TouchableOpacity style={styles.button} onPress={actualizarDescripcion}>
                            <Text style={styles.buttonText}>Modificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {setModalVisible(false); setModificar(false);}}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </Modal>)}
            {selectedItem && eliminar && (<Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setEliminar(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>¿Está seguro que desea eliminar este archivo?</Text>
                        <TouchableOpacity style={styles.button} onPress={eliminarArchivo}>
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {setModalVisible(false); setEliminar(false);}}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </Modal>)}
            {archivos.length == 0 ? (<Text> 
                No hay archivos, toma una foto o graba un video
            </Text>) : 
            (<FlatList
                data={archivos}
                renderItem={ ({item}) => <View style={styles.containerCamara}>
                {item.tipo==1 && (<Image source={{uri: item['uri']}} style={styles.foto}/>)}
                {item.tipo==2 && (<Video style={styles.foto} source={{uri: item['uri']}} useNativeControls resizeMode={ResizeMode.CONTAIN}/>)}
                <View>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                <View style={styles.ControlsContainer}>
                <Text style={styles.opciones}>
                    <Entypo name={'location-pin'} size={14} color={'black'} />{item.ubicacion}
                </Text>
                    <Button 
                      icon='edit'
                      onPress={() => abrirModal(item)} color={'black'}
                    />
                    <Button 
                    icon='trash'
                    color={'black'}
                    onPress={() => abrirModalE(item)}
                    />
                </View>
                </View>
                </View>}
                keyExtractor={ archivo => archivo.id}
            />)}
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical:20,
    },
    foto: {
        flex:1,
        width: 300,
        height: 450,
    },
    containerCamara: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#d9d9d9',
        padding: 20,
        marginVertical: 10,
    },
    descripcion: {
        fontSize: 18,
        width: 300,
        marginTop:10,
    },
    opciones:{
        marginTop:10,
    },
    ControlsContainer: {
        height: 70,
        width:300,
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semi-transparente
      },
      modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      input: {
        marginTop: 0,
        height: 50,
        width: '90%',
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#e1e1e1',
        marginLeft: 10,
        marginBottom: 5,
    },
    button: {
        padding: 10,
        height: 40,
        width: 110,
        backgroundColor: '#e1e1e1',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        marginVertical: 5,
    },
});