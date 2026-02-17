import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Image, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import { Mic, GraduationCap, User } from 'lucide-react-native';

const BACKEND_URL = 'https://mvp-idiomas-server.onrender.com';

export default function TalkmeScreen({ navigation }) {
    const [recording, setRecording] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastTranslation, setLastTranslation] = useState(null);
    const [activeButton, setActiveButton] = useState(null);

    // Sound
    // Chirp removed temporarily to fix build (missing asset)
    /* const playChirp = async () => { ... } */

    const playAudio = async (base64) => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: `data:audio/mp3;base64,${base64}` },
                { shouldPlay: true }
            );
        } catch (e) { console.error('Audio Play Error:', e); }
    };

    // Permissions
    useEffect(() => {
        (async () => {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') Alert.alert('Aviso', 'Se requiere micrófono.');
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        })();
    }, []);

    const startRecording = async (lang) => {
        try {
            // await playChirp(); // Disabled
            setActiveButton(lang);
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Record Start Error:', err);
            setActiveButton(null);
        }
    };

    const stopRecording = async (fromLang, toLang) => {
        if (!recording) return;

        setIsProcessing(true);
        setActiveButton(null);

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            // Upload
            const formData = new FormData();
            formData.append('audio', { uri, type: 'audio/m4a', name: 'audio.m4a' });
            formData.append('userId', 'mobile-guest');
            formData.append('fromLang', fromLang);
            formData.append('toLang', toLang);

            // Network Timeout Controller
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(`${BACKEND_URL}/api/translate`, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            }).catch(err => {
                throw new Error(err.name === 'AbortError' ? 'Tiempo de espera agotado' : 'No me puedo conectar con el servidor 🛑');
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.details || `Error del Servidor: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) throw new Error(data.message || 'Error desconocido en API');

            setLastTranslation({
                original: data.originalText,
                translated: data.translatedText
            });

            if (data.audioBase64) await playAudio(data.audioBase64);

        } catch (error) {
            console.error('Translation process error:', error);
            Alert.alert("⚠️ Error de Conexión", error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* HEADER: LOGO + MENU */}
            <View style={styles.header}>
                <Image
                    source={require('../assets/puentes_logo.png')}
                    style={styles.logoImage}
                />
                {/* <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>PUENTES GLOBALES</Text> */}
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Academy')} style={styles.iconBtn}>
                        <GraduationCap color="white" size={28} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconBtn}>
                        <User color="white" size={28} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* TRANSLATION BOX */}
            <View style={styles.displayContainer}>
                {lastTranslation ? (
                    <>
                        <Text style={styles.textOriginal}>"{lastTranslation.original}"</Text>
                        <Text style={styles.textArrow}>⬇️</Text>
                        <Text style={styles.textTranslated}>"{lastTranslation.translated}"</Text>
                    </>
                ) : (
                    <Text style={styles.placeholder}>Presiona un botón para hablar...</Text>
                )}
            </View>

            {/* CONTROLS: FULL CENTERED */}
            <View style={styles.controlsArea}>

                {/* BUTTON 2: TARGET (English) */}
                <TouchableOpacity
                    style={[styles.btn, styles.btnTarget, activeButton === 'target' && styles.btnActive]}
                    onPressIn={() => startRecording('target')}
                    onPressOut={() => stopRecording('en', 'es')}
                    disabled={isProcessing}
                >
                    <View style={{ transform: [{ rotate: '180deg' }], alignItems: 'center' }}>
                        <Text style={styles.btnLabel}>ENGLISH (ELLOS)</Text>
                        <Mic color="white" size={32} />
                    </View>
                </TouchableOpacity>

                {/* SPACER */}
                <View style={{ height: 30 }} />

                {/* BUTTON 1: SOURCE (Spanish) */}
                <TouchableOpacity
                    style={[styles.btn, styles.btnSource, activeButton === 'source' && styles.btnActive]}
                    onPressIn={() => startRecording('source')}
                    onPressOut={() => stopRecording('es', 'en')}
                    disabled={isProcessing}
                >
                    <Mic color="white" size={32} />
                    <Text style={styles.btnLabel}>ESPAÑOL (YO)</Text>
                </TouchableOpacity>

            </View>

            {/* LOADING OVERLAY */}
            {isProcessing && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                    <Text style={{ color: 'white', marginTop: 10 }}>Traduciendo...</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingTop: 10
    },
    header: {
        height: 70,
        flexDirection: 'row', // Horizontal layout
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        marginTop: 10
    },
    logoImage: {
        width: 180,
        height: 50,
        resizeMode: 'contain'
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15
    },
    iconBtn: {
        padding: 5
    },
    displayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    textOriginal: {
        color: '#94a3b8',
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    textArrow: {
        fontSize: 24,
        marginVertical: 10,
        color: '#475569'
    },
    textTranslated: {
        color: '#22d3ee',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    placeholder: {
        color: '#64748b',
        fontSize: 16
    },
    controlsArea: {
        height: 400, // Large control area
        paddingHorizontal: 30, // Narrower for nicer button shape
        justifyContent: 'center',
        marginBottom: 40 // Bottom margin since no nav bar
    },
    btn: {
        height: 150, // Very nice large touch area
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    btnTarget: {
        backgroundColor: '#ef4444' // Red
    },
    btnSource: {
        backgroundColor: '#0ea5e9' // Blue
    },
    btnActive: {
        backgroundColor: '#10b981',
        transform: [{ scale: 0.98 }]
    },
    btnLabel: {
        color: 'white',
        fontSize: 24, // Large legible font
        fontWeight: '900',
        marginTop: 10,
        marginBottom: 10,
        letterSpacing: 1
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99
    }
});
