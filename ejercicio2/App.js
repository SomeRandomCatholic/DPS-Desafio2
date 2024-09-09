import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';
import Multimedia from './src/screens/Multimedia';
import ListaArchivos from './src/screens/ListaArchivos';
import Camara from './src/screens/Camara';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <>
            <StatusBar
                barStyle="light-content"
                backgroundColor="black"
            />
            <NavigationContainer>
                <Tab.Navigator screenOptions={({ route }) => ({
                    tabBarIcon: ({ size }) => {
                        let iconName;
                      
                        if (route.name === 'Multimedia') {
                            iconName = 'video';
                        } else if (route.name === 'Lista de archivos') {
                            iconName = 'list';
                        }
                        return <Icon name={iconName} size={size} color="black" />;
                    },
                    tabBarStyle: {
                        backgroundColor: '#9494d4',
                        paddingBottom: 5,
                        height: 60,
                    },
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: '#2c3e50',
                })}>
                    <Tab.Screen name="Multimedia" component={Multimedia} options={{
                        headerStyle: {
                            backgroundColor: '#9494d4',
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerTitleAlign: 'center',
                    }}/>
                    <Tab.Screen name="Lista de archivos" component={ListaArchivos} options={{
                        headerStyle: {
                          backgroundColor: '#9494d4',
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerTitleAlign: 'center',
                    }}/>
                </Tab.Navigator>
            </NavigationContainer>
        </>
    );  
} 