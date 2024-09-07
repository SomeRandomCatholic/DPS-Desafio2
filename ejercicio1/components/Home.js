import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Alert } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

const Home = ({ navigation, route }) => {

    const [contactosGlobal, setContactosGlobal] = useState([]);
    const userID = route.params.userID;
    
    const obtenerContactos = async () => {
        try {
            const obtenidos = await AsyncStorage.getItem("contacts");

            if (obtenidos)
                setContactosGlobal(JSON.parse(obtenidos));

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { 
        obtenerContactos();
    }, []);

    useEffect(() => { 
        obtenerContactos();
        navigation.setParams({cargar: false});
    }, [route.params.cargar == true]);

    const renderContactos = ({ item }) => {
        if (item.userID == userID) {

            let estilo = "", resultado = "";
            const dias = calcularDistancia(item.fecha[0]);

            if (dias < 0) {
                estilo = "red";
                resultado = "Pasado";
            } else if (dias == 0) {
                estilo = "green";
                resultado = "Hoy Cumpleaños";
            } else if(dias == 1){
                estilo = "blue";
                resultado = dias + " día"
            }else{
                estilo = "blue";
                resultado = dias + " días";
            }

            return (
                <TouchableHighlight style={{
                    padding: 10,
                    borderBottomWidth: 3,
                    borderBottomColor: estilo
                }} onLongPress={() => eliminarContacto(item.key)}>
                    <View>
                        <Text>{item.nombre} {item.apellido}</Text>
                        <Text>{resultado}</Text>
                    </View>
                </TouchableHighlight>
            )
        }

    }

    const calcularDistancia = (cumpleaños) => {
        const fechaHoy = new Date();
        const fechaCumple = new Date(cumpleaños);

        const diferencia = fechaCumple - fechaHoy;

        const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

        return dias;
    }


    const eliminarContacto = key => {

        Alert.alert("Eliminar Persona", "¿Estás seguro de eliminar a esta persona?",
            [
                {
                    text: "Aceptar",
                    onPress: () => {
                        const x = contactosGlobal.filter(item => item.key !== key);
                        setContactosGlobal(x);
                        guardarContacto(JSON.stringify(x));
                    }
                },
                { text: "Cancelar" }
            ]
        )

    }

    const guardarContacto = async (newUser) => {
        try {
            await AsyncStorage.setItem("contacts", newUser);
        } catch (error) {
            console.log(error);
        }
    }

    let hayContactos = false;

    if (contactosGlobal.length != 0) {

        contactosGlobal.forEach(element => {
            if (element.userID == userID)
                hayContactos = true;
        });
    }

    if (hayContactos)
        return (
            <View style={styles.container}>

                <FlatList
                    data={contactosGlobal}
                    renderItem={renderContactos}
                    keyExtractor={item => item.key}
                />
                <Button title="+" onPress={() => navigation.navigate("Agregar Persona")} />

            </View>
        )
    else
        return (
            <View style={styles.container}>
                <Text>No hay registros</Text>
                <Text>Cara triste</Text>
                <Button title="+" onPress={() => navigation.navigate("Agregar Persona")} />
            </View>)

}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pasado: {
        padding: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'red'
    },
    presente: {
        padding: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'green'
    },
    futuro: {
        padding: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'blue'
    }
})
