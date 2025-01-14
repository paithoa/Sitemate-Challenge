// filepath: /c:/Users/hhasan/Documents/Sitemate-Challenge/Sitemate-Challenge-Expo/my-app/app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Button, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './CustomAlert';

const API_KEY = '183daca270264bad86fc5b72972fb82a';
const API_URL = `https://newsapi.org/v2/everything`;

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('searchHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
  };

  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const searchNews = async () => {
    if (!query.trim()) {
      showAlert('Please enter a news topic to search.');
      return;
    }

    setIsLoading(true); // Set loading state to true
    setResults([]); // Clear previous results
    try {
      // Add query to history if it doesn't already exist
      if (!history.includes(query.trim())) {
        const newHistory = [query.trim(), ...history];
        setHistory(newHistory);
        saveHistory(newHistory);
      }

      const response = await fetch(`${API_URL}?q=${query}&apiKey=${API_KEY}`);
      const data = await response.json();

      if (response.ok && data.articles.length > 0) {
        setResults(data.articles);
      } else {
        showAlert('No articles found for your search. Try another term.');
      }
    } catch (error) {
      showAlert('Unable to fetch news. Please check your internet connection.');
      console.error('Network error:', error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search news..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={searchNews} />

      {isLoading && <Text style={styles.loading}>Loading...</Text>}

      {/* Search History */}
      <Text style={styles.heading}>Search History</Text>
      <View style={styles.historyContainer}>
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setQuery(item)}>
              <Text style={styles.historyItem}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.historyList}
        />
      </View>

      {/* Search Results */}
      <Text style={styles.heading}>Search Results</Text>
      <FlatList
        data={results}
        keyExtractor={(item, index) => item.url || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            {item.urlToImage ? (
              <Image source={{ uri: item.urlToImage }} style={styles.image} />
            ) : null}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          !isLoading && <Text style={styles.noResults}>No results to display</Text>
        }
      />

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  loading: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
    marginVertical: 10,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  historyContainer: {
    height: 100,
    marginBottom: 20,
  },
  historyList: {
    flexGrow: 0,
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 5,
    color: '#007BFF',
  },
  resultItem: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  noResults: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 20,
  },
});