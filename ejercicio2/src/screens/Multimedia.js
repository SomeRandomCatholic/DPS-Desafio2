import React from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default function Multimedia() {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Botón presionado')}>
                <Icon name="camera" size={50} color="black" />
                <Text style={styles.buttonText}>Fotografía</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Botón presionado')}>
                <Icon name="video-camera" size={50} color="black" />
                <Text style={styles.buttonText}>Video</Text>
            </TouchableOpacity>
            </View>
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
});