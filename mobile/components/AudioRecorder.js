import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioRecorder({ onRecordingComplete, isProcessing }) {
    const [recording, setRecording] = useState(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    async function startRecording() {
        try {
            if (permissionResponse.status !== 'granted') {
                const resp = await requestPermission();
                if (resp.status !== 'granted') {
                    Alert.alert("Permiso denegado", "Necesitamos acceso al micrófono.");
                    return;
                }
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        setRecording(null);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        // For MVP Phase 2, we just pass the URI. 
        // The API service will handle the upload/conversion.
        onRecordingComplete(uri);
    }

    if (isProcessing) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color="#38bdf8" />
                <Text style={styles.text}>Procesando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, recording ? styles.recording : styles.idle]}
                onPress={recording ? stopRecording : startRecording}
            >
                <Text style={styles.buttonText}>
                    {recording ? '⏹️ Detener' : '🎤 Hablar'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    idle: {
        backgroundColor: '#2563eb', // Blue
    },
    recording: {
        backgroundColor: '#ef4444', // Red
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        color: '#94a3b8',
        fontSize: 10,
        marginTop: 4,
    }
});
