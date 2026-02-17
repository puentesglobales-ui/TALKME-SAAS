import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

// Screens
import TalkmeScreen from './screens/TalkmeScreen';
import AcademyScreen from './screens/AcademyScreen';

// Placeholder Profile
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
    <Text style={{ color: 'white' }}>Perfil de Usuario (Próximamente)</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0f172a', // Dark Blue Header
            },
            headerTintColor: '#fff', // White Back Button
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#0f172a' // Global BG
            }
          }}
        >
          {/* HOME: Full Screen (No Header) */}
          <Stack.Screen
            name="Talkme"
            component={TalkmeScreen}
            options={{ headerShown: false }}
          />

          {/* SUB-SCREENS: Show Header for Back Button */}
          <Stack.Screen
            name="Academy"
            component={AcademyScreen}
            options={{ title: 'Academia' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Mi Perfil' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
