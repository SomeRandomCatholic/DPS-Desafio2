import React from "react";
import { LogBox } from 'react-native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Home";
import AgregarPersona from "./AgregarPersona";
import CerrarSesion from "./CerrarSesion";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

const Drawer = createDrawerNavigator();

const Navigator = ({setPantalla, userID}) => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Contactos">
                <Drawer.Screen name="Contactos" component={Home} initialParams={{userID: userID}}/>
                <Drawer.Screen name="Agregar Persona" component={AgregarPersona} initialParams={{userID: userID}}/>
                <Drawer.Screen name="Cerrar Sesión" component={CerrarSesion} initialParams={{setPantalla: setPantalla}}/>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;