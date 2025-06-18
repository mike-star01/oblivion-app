import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomizeScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customRoast, setCustomRoast] = useState('');
  const [customRoasts, setCustomRoasts] = useState([]);
  const [dayNumber, setDayNumber] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      const savedRoasts = await AsyncStorage.getItem('customRoasts');
      const savedDayNumber = await AsyncStorage.getItem('manualDayNumber');
      
      if (savedTheme) setIsDarkMode(JSON.parse(savedTheme));
      if (savedRoasts) setCustomRoasts(JSON.parse(savedRoasts));
      if (savedDayNumber) setDayNumber(savedDayNumber);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      await AsyncStorage.setItem('customRoasts', JSON.stringify(customRoasts));
      if (dayNumber) {
        await AsyncStorage.setItem('manualDayNumber', dayNumber);
      }
      Alert.alert('Success', 'Settings saved successfully!');
      navigation.navigate('Home', {
        isDarkMode,
        dayNumber,
        customRoasts,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const addCustomRoast = () => {
    if (customRoast.trim()) {
      setCustomRoasts([...customRoasts, customRoast.trim()]);
      setCustomRoast('');
    }
  };

  const removeCustomRoast = (index) => {
    const newRoasts = customRoasts.filter((_, i) => i !== index);
    setCustomRoasts(newRoasts);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1a1a2e' : '#FFFFFF',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ddd',
      borderRadius: 8,
      padding: 10,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      backgroundColor: isDarkMode ? '#2a2a40' : '#FFFFFF',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#FF6B6B',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    switchLabel: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    roastItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#2d2d44' : '#F8F9FA',
      padding: 10,
      borderRadius: 8,
      marginBottom: 8,
    },
    roastText: {
      flex: 1,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginRight: 10,
    },
    removeButton: {
      backgroundColor: '#FF6B6B',
      padding: 5,
      borderRadius: 4,
    },
    removeButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Customize Your Experience</Text>

      <View style={styles.section}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Day Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter day number"
          value={dayNumber}
          onChangeText={setDayNumber}
          keyboardType="numeric"
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Custom Reality Check</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your custom reality check"
          value={customRoast}
          onChangeText={setCustomRoast}
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
        />
        <TouchableOpacity style={styles.button} onPress={addCustomRoast}>
          <Text style={styles.buttonText}>Add Reality Check</Text>
        </TouchableOpacity>
      </View>

      {customRoasts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Custom Reality Checks</Text>
          {customRoasts.map((roast, index) => (
            <View key={index} style={styles.roastItem}>
              <Text style={styles.roastText}>{roast}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeCustomRoast(index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={saveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
} 