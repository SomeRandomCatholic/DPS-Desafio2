import { Text, TextInput, TouchableHighlight, View, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard, Button } from 'react-native'
import { isValidElement, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ setPantalla, setUserID }) => {

    const [usuario, setUsuario] = useState("");
    const [contra, setContra] = useState("");
    const [usersObj, setUsersObj] = useState([]);

    const validar = () => {
        if (usuario === '' || contra === '') {
            Alert.alert("Error", "Debes llenar todos los campos");
            return;
        }

        if (usersObj.length == 0) {
            Alert.alert("Error", "No hay usuarios guardados. Debes registrarte primero");
            return;
        }

        let indice = -1;

        usersObj.forEach((element, key) => {
            let encontrado = false;

            if (element.correo == usuario)
                encontrado = true;
            if (element.usuario == usuario)
                encontrado = true;

            if (encontrado == true) {
                indice = key;
            }
        })

        if (indice == -1)
            Alert.alert("Error", "El usuario o el correo no existe en el sistema.");
        else {
            if (usersObj[indice].contraseña == contra) {
                setUserID(usersObj[indice].id);
                Alert.alert("Mensaje", "Inicio de Sesión Exitoso", [{ text: "Ok", onPress: () => setPantalla("Navigator") }]);
            } else {
                Alert.alert("Error", "La contraseña es incorrecta");
            }
        }
    }

    const obtenerUsuarios = async () => {
        try {
            const users = await AsyncStorage.getItem("users");
            if (users)
                setUsersObj(JSON.parse(users));

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    useEffect(() => {
        obtenerUsuarios();
    }, [usuario]);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container} >

                <Text>Agenda</Text>
                <TextInput placeholder='Correo / Usuario' onChangeText={text => setUsuario(text.trim())} value={usuario} />
                <TextInput placeholder='Contraseña' onChangeText={text => setContra(text.trim())} secureTextEntry={true} value={contra} />

                <Button onPress={() => validar()} title="Ingresar" />

                <View>
                    <Text>¿No tienes una cuenta?</Text>
                    <Text onPress={() => {
                        setUsuario("");
                        setContra("");
                        setPantalla("Registro");
                    }}>Regístrate</Text>
                </View>
            </View>

        </TouchableWithoutFeedback >
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },


});