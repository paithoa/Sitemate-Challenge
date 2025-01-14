import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  const searchArticles = async () => {
    try {
      setError('');
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=183daca270264bad86fc5b72972fb82a`
      );
      setArticles(response.data.articles);
    } catch (err) {
      setError('Failed to fetch articles. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for news..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={searchArticles} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <View style={styles.article}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  error: { color: 'red', marginBottom: 10 },
  article: { marginBottom: 15 },
  title: { fontWeight: 'bold' },
});

export default HomeScreen;
