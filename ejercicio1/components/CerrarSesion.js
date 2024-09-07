import React from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";

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
        <View style={sytles.container} >
            <Button onPress={cerrarSesion} title="Cerrar Sesión" />
        </View>
    )
}

export default CerrarSesion;

const sytles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})