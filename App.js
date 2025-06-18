import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomizeScreen from './CustomizeScreen';

const Stack = createNativeStackNavigator();

const ROAST_MESSAGES = [
  "You miss them? You also miss being disrespected?",
  "Texting your ex is like reheating McDonald's fries.",
  "They didn't even wash their sheets.",
  "Remember when they forgot your birthday?",
  "They probably still use Internet Explorer.",
  "Your ex is like expired milk - best left in the past.",
  "They probably still have their mom do their laundry.",
  "Remember when they said they'd call you back?",
  "Your ex is like a broken calculator - they just don't add up.",
  "They probably still use a flip phone."
];

function HomeScreen({ navigation, route }) {
  const [daysSinceContact, setDaysSinceContact] = useState(0);
  const [lastReset, setLastReset] = useState(null);
  const [exName, setExName] = useState('');
  const [dailyRoast, setDailyRoast] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customRoasts, setCustomRoasts] = useState([]);

  useEffect(() => {
    loadData();
    loadSettings();
  }, []);

  // Update state when receiving new params
  useEffect(() => {
    if (route.params) {
      const { isDarkMode: newDarkMode, dayNumber, customRoasts: newRoasts } = route.params;
      if (newDarkMode !== undefined) setIsDarkMode(newDarkMode);
      if (dayNumber) setDaysSinceContact(parseInt(dayNumber));
      if (newRoasts) setCustomRoasts(newRoasts);
    }
  }, [route.params]);

  // Add focus listener to reload settings when returning to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSettings();
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      const savedRoasts = await AsyncStorage.getItem('customRoasts');
      if (savedTheme) setIsDarkMode(JSON.parse(savedTheme));
      if (savedRoasts) setCustomRoasts(JSON.parse(savedRoasts));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadData = async () => {
    try {
      const savedLastReset = await AsyncStorage.getItem('lastReset');
      const savedExName = await AsyncStorage.getItem('exName');
      const manualDayNumber = await AsyncStorage.getItem('manualDayNumber');

      if (manualDayNumber) {
        setDaysSinceContact(parseInt(manualDayNumber));
      } else if (savedLastReset) {
        const lastResetDate = new Date(parseInt(savedLastReset));
        const now = new Date();
        const diffTime = Math.abs(now - lastResetDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysSinceContact(diffDays);
        setLastReset(lastResetDate);
      } else {
        const now = new Date();
        await AsyncStorage.setItem('lastReset', now.getTime().toString());
        setLastReset(now);
        setDaysSinceContact(0);
      }

      if (savedExName) {
        setExName(savedExName);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleTextChange = (text) => {
    setExName(text);
  };

  const handleSaveName = async () => {
    try {
      await AsyncStorage.setItem('exName', exName);
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  const resetStreak = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem('lastReset', now.getTime().toString());
      setLastReset(now);
      setDaysSinceContact(0);
      Alert.alert('Streak Reset', "It's okay. One text doesn't erase your progress 🫂");
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  };

  const generateNewRoast = () => {
    const allRoasts = [...ROAST_MESSAGES, ...customRoasts];
    const randomRoast = allRoasts[Math.floor(Math.random() * allRoasts.length)];
    setDailyRoast(randomRoast);
  };

  useEffect(() => {
    generateNewRoast();
  }, [customRoasts]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1a1a2e' : '#FFFFFF',
    },
    inner: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 40,
    },
    streakContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    streakText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FF6B6B',
    },
    streakSubtext: {
      fontSize: 16,
      color: isDarkMode ? '#ddd' : '#666',
      marginTop: 5,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 25,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ddd',
      borderRadius: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      backgroundColor: isDarkMode ? '#2a2a40' : '#FFFFFF',
    },
    roastContainer: {
      backgroundColor: isDarkMode ? '#2d2d44' : '#F8F9FA',
      padding: 20,
      borderRadius: 15,
      marginBottom: 30,
      width: '100%',
      alignItems: 'center',
    },
    roastLabel: {
      fontSize: 16,
      color: isDarkMode ? '#bbb' : '#666',
      marginBottom: 10,
      fontStyle: 'italic',
    },
    roastText: {
      fontSize: 18,
      color: isDarkMode ? '#FFFFFF' : '#333',
      textAlign: 'center',
      marginBottom: 15,
    },
    roastButton: {
      marginTop: 5,
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#444' : '#ddd',
      borderRadius: 20,
    },
    roastButtonText: {
      color: isDarkMode ? '#FFFFFF' : '#333',
      fontSize: 14,
    },
    resetButton: {
      backgroundColor: '#FF6B6B',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      width: '100%',
      alignItems: 'center',
    },
    resetButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    customizeButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      padding: 10,
      backgroundColor: isDarkMode ? '#2d2d44' : '#F8F9FA',
      borderRadius: 20,
      zIndex: 1,
    },
    customizeButtonText: {
      color: isDarkMode ? '#FFFFFF' : '#333',
      fontSize: 14,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <TouchableOpacity
          style={styles.customizeButton}
          onPress={() => navigation.navigate('Customize')}
        >
          <Text style={styles.customizeButtonText}>Customize</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>📵 Ex Tracker</Text>

          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>Day {daysSinceContact}</Text>
            <Text style={styles.streakSubtext}>
              since you last contacted {exName ? <Text style={{ fontWeight: '600' }}>{exName}</Text> : 'them'}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter ex's nickname"
              value={exName}
              onChangeText={handleTextChange}
              onBlur={handleSaveName}
              onSubmitEditing={handleSaveName}
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          <View style={styles.roastContainer}>
            <Text style={styles.roastLabel}>💔 Today's Reality Check</Text>
            <Text style={styles.roastText}>{dailyRoast}</Text>
            <TouchableOpacity onPress={generateNewRoast} style={styles.roastButton}>
              <Text style={styles.roastButtonText}>Give me another 🔁</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={resetStreak}>
            <Text style={styles.resetButtonText}>I Texted Them 😩</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Customize" 
          component={CustomizeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}