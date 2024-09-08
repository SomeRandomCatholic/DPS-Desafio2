import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableWithoutFeedback } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Icon } from 'react-native-elements'

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
        navigation.setParams({ cargar: false });
    }, [route.params.cargar == true]);

    const renderContactos = ({ item }) => {
        if (item.userID == userID) {

            let estilo = "", resultado = "";
            const dias = calcularDistancia(item.fecha[0]);

            if (dias < 0) {
                estilo = "pasado";
                resultado = "Pasado";
            } else if (dias == 0) {
                estilo = "presente";
                resultado = "Hoy\nCumpleaños";
            } else if (dias == 1) {
                estilo = "futuro";
                resultado = dias + " día"
            } else {
                estilo = "futuro";
                resultado = dias + " días";
            }

            const detEstilo = () => {
                if (estilo == "pasado")
                    return styles.pasado;
                else if (estilo == "presente")
                    return styles.presente;
                else if (estilo == "futuro")
                    return styles.futuro;
            }
            return (
                <TouchableHighlight style={detEstilo()} onLongPress={() => eliminarContacto(item.key)}>
                    <View style={styles.elementoLista}>
                        <Text style={styles.textoLista}>{item.nombre} {item.apellido}</Text>
                        <Text style={estilo == "presente" ? styles.textoHoy : styles.textoLista}>{resultado}</Text>
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

    const BotonCircular = () => {
        return (
            <TouchableWithoutFeedback onPress={() => navigation.navigate("Agregar Persona")}>
                <View style={styles.buttonAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    if (hayContactos)
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Mantenga presionado un contacto para eliminarlo</Text>
                <FlatList
                    data={contactosGlobal}
                    renderItem={renderContactos}
                    keyExtractor={item => item.key}
                />

                <BotonCircular/>

            </View>
        )
    else
        return (
            <View style={styles.container}>
                <Text style={styles.mensaje}>¡No hay registros!</Text>
                <Icon
                    name='sentiment-very-dissatisfied'
                    color='grey'
                    size={100} />
                <BotonCircular/>
            </View>)

}

export default Home;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pasado: {
        width: 350,
        height: 60,
        marginTop: 20,
        borderRadius: 25,
        backgroundColor: "#e34444",

    },
    presente: {
        width: 350,
        height: 60,
        marginTop: 20,
        borderRadius: 25,
        backgroundColor: "#a3ca72",
    },
    futuro: {
        width: 350,
        height: 60,
        marginTop: 20,
        borderRadius: 25,
        backgroundColor: "#2a7bc7",
    },
    elementoLista: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    textoLista: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 15,
    },
    textoHoy: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 8,
    },
    mensaje: {
        fontSize: 30,
        marginBottom: 20,
        color: 'grey',
        fontWeight: 'bold',
    },
    titulo: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20
    },
    buttonAdd: {
        width: 60,
        height: 60,
        backgroundColor: '#1873c7',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        position: 'absolute',
        right: 20,
        bottom: 30,
    },
    buttonText: {
        fontSize: 25,
        color: 'white',
    },

})
