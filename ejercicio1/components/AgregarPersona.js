import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard, Alert, TouchableHighlight } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AgregarPersona = ({ navigation, route }) => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [fecha, setFecha] = useState([]);
    const [calendarioVisible, setCalendarioVisible] = useState(false);
    const [contactosGlobal, setContactosGlobal] = useState([]);

    const confirmarFecha = date => {
        const opciones = { year: "numeric", month: "long", day: "2-digit" };
        setFecha([date, date.toLocaleDateString("es-ES", opciones)]);
        setCalendarioVisible(false);
    }

    const validar = () => {
        if (nombre === '' || apellido === '' || correo === '' || telefono === '' || fecha == '') {
            Alert.alert("Error", "Debes llenar todos los campos");
            return;
        }

        const expresion1 = RegExp(/\S+@\S+\.\S+/);
        if (!expresion1.exec(correo)) {
            Alert.alert("Error", "Debe ingresar un correo válido.");
            return;
        }

        const expresion2 = RegExp(/^[0-9]{4}-[0-9]{4}$/);
        if (!expresion2.exec(telefono)) {
            Alert.alert("Error", "Debe ingresar un número telefónico de 8 dígitos con guión.");
            return;
        }

        let bandera = true;
        let userID = route.params.userID;

        // Valida que la persona no está ya en los contactos
        if (contactosGlobal.length != 0) {

            contactosGlobal.forEach((element) => {
                if (element.userID == userID) {
                    const nombreElemento = element.nombre + " " + element.apellido;
                    const nombreNuevo = nombre + " " + apellido;
                    if (nombreElemento === nombreNuevo) {
                        Alert.alert("Error", "El contacto ya había sido añadido " + userID + " y " + element.userID);
                        bandera = false;
                        return;
                    }
                }

            });

        }


        if (bandera) {
            let key = contactosGlobal.length + 1;
            const nuevoContacto = { userID, nombre, apellido, correo, telefono, fecha, key };
            const nuevo = [...contactosGlobal, nuevoContacto];
            setContactosGlobal(nuevo);

            guardarContacto(JSON.stringify(nuevo));

            Alert.alert("Mensaje", "Contacto agregado con éxito",
                [{ text: "Ok", onPress: () => navigation.navigate("Contactos", { cargar: true }) }]);
            limpiar();
        }
    }

    useEffect(() => {
        const obtenerContactos = async () => {
            try {
                const contacts = await AsyncStorage.getItem("contacts");
                if (contacts)
                    setContactosGlobal(JSON.parse(contacts));

            } catch (error) {
                console.log(error);
            }
        }

        obtenerContactos();
    }, []);

    const guardarContacto = async (newUser) => {
        try {
            await AsyncStorage.setItem("contacts", newUser);
        } catch (error) {
            console.log(error);
        }
    }

    const limpiar = () => {
        setNombre("");
        setApellido("");
        setCorreo("");
        setTelefono("");
        setFecha([]);
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container} >
                <TextInput placeholder='Nombre' onChangeText={texto => setNombre(texto.trim())} value={nombre} style={styles.input} />

                <TextInput placeholder='Apellido' onChangeText={texto => setApellido(texto.trim())} value={apellido} style={styles.input} />

                <TextInput placeholder='Correo' onChangeText={texto => setCorreo(texto.trim())} keyboardType="email-address" value={correo} style={styles.input} />

                <TextInput placeholder='Número de Teléfono (con guión)' onChangeText={texto => setTelefono(texto.trim())} keyboardType="number-pad" value={telefono} style={styles.input} />

                <View>

                    <TouchableHighlight onPress={() => setCalendarioVisible(true)}>
                        <TextInput placeholder={fecha[1] ? fecha[1] : 'Fecha de Cumpleaños'} editable={false} style={styles.input}/>
                    </TouchableHighlight>

                    <DateTimePickerModal
                        isVisible={calendarioVisible}
                        mode="date"
                        onConfirm={confirmarFecha}
                        onCancel={() => setCalendarioVisible(false)}
                        locale="es_ES"
                        headerTextIOS="Elige la fecha"
                        cancelTextIOS="Cancelar"
                        confirmTextIOS="Confirmar"
                    />
                </View>

                <TouchableWithoutFeedback onPress={() => validar()}>
                    <View style={styles.inputButton}>
                        <Text style={styles.buttonText}>Agregar Persona</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default AgregarPersona;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 320,
        height: 45,
        paddingLeft: 10,
        fontSize: 16,
        borderColor: 'grey',
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 8,
        backgroundColor: 'white',
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