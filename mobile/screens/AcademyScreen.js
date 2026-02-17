import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const WEB_APP_URL = 'https://www.puentesglobales.com/home/';

export default function AcademyScreen() {
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: WEB_APP_URL }}
                style={styles.webview}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#06b6d4" />
                    </View>
                )}
                allowsInlineMediaPlayback={true} // For audio recording in web
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
});
