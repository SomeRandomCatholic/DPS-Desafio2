import { Text, TextInput, Image, View, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { useEffect, useState } from 'react';
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

                <Image source={require('../assets/TituloLogin.png')} style={styles.titulo} />
                
                <TextInput placeholder='Correo / Usuario' onChangeText={text => setUsuario(text.trim())} value={usuario} style={styles.input} />
                
                <TextInput placeholder='Contraseña' onChangeText={text => setContra(text.trim())} secureTextEntry={true} value={contra} style={styles.input} />
                
                <TouchableWithoutFeedback onPress={() => validar()}>
                    <View style={styles.inputButton}>
                        <Text style={styles.buttonText}>Ingresar</Text>
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.footer}>
                    <Text style={styles.question}>¿No tienes una cuenta?</Text>
                    <Text onPress={() => {
                        setUsuario("");
                        setContra("");
                        setPantalla("Registro");
                    }} style={styles.link}>Regístrate</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    titulo: {
        width: 300,
        height: 150,
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
    footer:{
        width: 320,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 50,
    },
    question:{
        fontSize: 16,
        color: 'grey',
    },
    link:{
        fontSize: 16,
        color: '#1873c7',
        fontWeight: 'bold',
    }
});