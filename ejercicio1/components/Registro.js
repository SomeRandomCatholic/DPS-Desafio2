import { Text, TextInput, TouchableHighlight, View, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard, Button } from 'react-native'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Registro = ({ setPantalla }) => {
    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContra] = useState("");
    const [pass2, setPass2] = useState("");
    const [usersObj, setUsersObj] = useState([]);

    const validar = () => {
        // Verifica que todo este lleno
        if (usuario === '' || correo === '' || contraseña === '' || pass2 == '') {
            Alert.alert("Error", "Debes llenar todos los campos");
            return;
        }

        // Verifica que las contraseñas coincidan
        if (contraseña !== pass2) {
            Alert.alert("Error", "Las contraseñas no coinciden. Intente nuevamente.")
            return;
        }

        // Validar el correo
        const expresion = RegExp(/\S+@\S+\.\S+/);
        if(!expresion.exec(correo)){
            Alert.alert("Error", "Debe ingresar un correo válido.");
            return;
        }

        let bandera = true;

        // Valida que el usuario y el correo no estén tomados ya.
        if (usersObj.length != 0) {

            usersObj.forEach((element) => {
                const correoGuardado = element.correo;
                if (correoGuardado === correo) {
                    Alert.alert("Error", "El correo ya está registrado");
                    bandera = false;
                    return;
                }

                const usuarioGuardado = element.usuario;
                if (usuarioGuardado === usuario) {
                    Alert.alert("Error", "El usuario ya está tomado.");
                    bandera = false;
                    return;
                }
            });

        }

        if (bandera) {
            let id = usersObj.length + 1;
            const nuevoUsuario = { id, usuario, correo, contraseña };
            const nuevo = [...usersObj, nuevoUsuario];
            setUsersObj(nuevo);

            guardarUsuario(JSON.stringify(nuevo));

            Alert.alert("Mensaje", "Usuario agregado con éxito", [{text: "Ok", onPress: () => setPantalla("Login")}]);

        }

    }

    const guardarUsuario = async (newUser) => {
        try {
            await AsyncStorage.setItem("users", newUser);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                const users = await AsyncStorage.getItem("users");
                if (users)
                    setUsersObj(JSON.parse(users));

            } catch (error) {
                console.log(error);
            }
        }

        obtenerUsuarios();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container} >
                <TouchableHighlight onPress={() => setPantalla("Login")}>
                    <Text>Regresar</Text>
                </TouchableHighlight>
                <Text>Registrarse</Text>
                <TextInput placeholder='Usuario' onChangeText={text => setUsuario(text.trim())} />
                <TextInput placeholder='Correo' onChangeText={text => setCorreo(text.trim())} keyboardType='email-address' />
                <TextInput placeholder='Contraseña' onChangeText={text => setContra(text.trim())} />
                <TextInput placeholder='Confirmar contraseña' onChangeText={text => setPass2(text.trim())} />

                <Button onPress={() => validar()} title="Registrarse" />

            </View>
        </TouchableWithoutFeedback>
    )
}


export default Registro;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
