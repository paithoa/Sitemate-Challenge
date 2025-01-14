import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Button, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Image 
} from 'react-native';

const API_KEY = '183daca270264bad86fc5b72972fb82a';
const API_URL = `https://newsapi.org/v2/everything`;

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchNews = async () => {
    if (!query.trim()) {
      Alert.alert('Input Error', 'Please enter a news topic to search.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}?q=${query}&apiKey=${API_KEY}`);
      const data = await response.json();

      if (data.articles) {
        setResults(data.articles);
      } else {
        Alert.alert('Error', 'No results found. Try another search term.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
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
});