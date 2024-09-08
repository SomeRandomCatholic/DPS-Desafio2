import React from "react";
import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback } from "react-native";

const CerrarSesion = ({ route }) => {

    const cerrarSesion = () => {
        Alert.alert("Mensaje", "¿Estás seguro de querer cerrar sesión?",
            [
                {
                    text: "Aceptar",
                    onPress: () => {
                        const {setPantalla }= route.params;
                        setPantalla("Login");
                }
                },
                { text: "Cancelar" }
            ]
        )
    }
    return (
        <View style={styles.container} >
            <TouchableWithoutFeedback onPress={() => cerrarSesion()}>
                    <View style={styles.inputButton}>
                        <Text style={styles.buttonText}>Cerrar Sesión</Text>
                    </View>
                </TouchableWithoutFeedback>
        </View>
    )
}

export default CerrarSesion;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputButton: {
        width: 320,
        height: 45,
        backgroundColor: '#1873c7',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText:{
        fontSize: 20,
        color: 'white',
    },
})