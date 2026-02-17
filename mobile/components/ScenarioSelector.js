import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function ScenarioSelector({ scenarios, selectedScenario, onSelect, guestMode }) {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {scenarios.map((scenario) => {
                    const isSelected = selectedScenario?.id === scenario.id;
                    const isLocked = guestMode && scenario.locked;

                    return (
                        <TouchableOpacity
                            key={scenario.id}
                            onPress={() => {
                                if (isLocked) {
                                    alert("🔒 Contenido Premium. Suscríbete para acceder.");
                                    return;
                                }
                                onSelect(scenario);
                            }}
                            style={[
                                styles.card,
                                isSelected ? styles.selectedCard : styles.unselectedCard,
                                isLocked && styles.lockedCard
                            ]}
                        >
                            <Text style={styles.emoji}>
                                {isLocked ? '🔒' : scenario.emoji}
                            </Text>
                            <Text style={[
                                styles.title,
                                isSelected ? styles.selectedText : styles.unselectedText,
                                isLocked && styles.lockedText
                            ]}>
                                {scenario.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        height: 90,
        backgroundColor: '#0f172a',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    scrollContent: {
        padding: 15,
        gap: 10,
    },
    card: {
        padding: 12,
        borderRadius: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
        borderWidth: 1,
    },
    selectedCard: {
        backgroundColor: '#2563eb',
        borderColor: '#3b82f6',
    },
    unselectedCard: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
    },
    emoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    title: {
        fontSize: 10,
        fontWeight: '600',
    },
    selectedText: {
        color: '#fff',
    },
    unselectedText: {
        color: '#94a3b8',
    },
    lockedCard: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        opacity: 0.5,
    },
    lockedText: {
        color: '#64748b',
    }
});
