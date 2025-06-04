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

const ROAST_MESSAGES = [
  "You miss them? You also miss being disrespected?",
  "Texting your ex is like reheating McDonald's fries.",
  "They didn't even wash their sheets.",
  "Remember when they forgot your birthday?",
  "They probably still use Internet Explorer.",
  "Your ex is like expired milk – best left in the past.",
  "They probably still have their mom do their laundry.",
  "Remember when they said they'd call you back?",
  "Your ex is like a broken calculator – they just don't add up.",
  "They probably still use a flip phone."
];

export default function App() {
  const [daysSinceContact, setDaysSinceContact] = useState(0);
  const [lastReset, setLastReset] = useState(null);
  const [exName, setExName] = useState('');
  const [dailyRoast, setDailyRoast] = useState('');

  useEffect(() => {
    loadData();
    generateNewRoast();
  }, []);

  const loadData = async () => {
    try {
      const savedLastReset = await AsyncStorage.getItem('lastReset');
      const savedExName = await AsyncStorage.getItem('exName');

      if (savedLastReset) {
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
      Alert.alert('Streak Reset', 'It’s okay. One text doesn’t erase your progress 🫂');
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  };

  const generateNewRoast = () => {
    const randomRoast = ROAST_MESSAGES[Math.floor(Math.random() * ROAST_MESSAGES.length)];
    setDailyRoast(randomRoast);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style="light" />
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
              placeholderTextColor="#999"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          <View style={styles.roastContainer}>
            <Text style={styles.roastLabel}>💔 Today’s Reality Check</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
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
    color: '#fff',
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
    color: '#ddd',
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
    borderColor: '#444',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#2a2a40',
  },
  roastContainer: {
    backgroundColor: '#2d2d44',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  roastLabel: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  roastText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  roastButton: {
    marginTop: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#444',
    borderRadius: 20,
  },
  roastButtonText: {
    color: '#fff',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
