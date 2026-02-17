import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

export default function LoginScreen({ onLoginSuccess, onGuestLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (loading) return;
        setLoading(true);

        // Simple validation
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa email y contraseña');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert('Error al ingresar', error.message);
            setLoading(false);
        } else {
            // Success!
            // App.js listener will handle state change, but we can also trigger callback
            if (onLoginSuccess) onLoginSuccess();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Puentes Globales Mobile</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.guestButton]}
                    onPress={onGuestLogin}
                >
                    <Text style={[styles.buttonText, styles.guestButtonText]}>Ingresar como Invitado</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#0f172a',
    },
    card: {
        backgroundColor: '#1e293b',
        padding: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 30,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    input: {
        backgroundColor: '#0f172a',
        color: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#334155',
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    guestButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#64748b',
        marginTop: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    guestButtonText: {
        color: '#cbd5e1',
        fontWeight: 'normal',
    }
});
