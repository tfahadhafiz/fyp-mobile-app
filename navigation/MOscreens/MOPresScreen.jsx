import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

export default function MOPresScreen({ navigation }) {
  const [fetchedPresentations, setFetchedPresentations] = useState([]);
  const isFocused = useIsFocused(); // Get the focused state of the screen

  useEffect(() => {
    fetch('http://3.26.23.172/presentations')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(a.presdate) - new Date(b.presdate));
        setFetchedPresentations(sortedData); // Update the fetchedPresentations
      })
      .catch((error) => {
        console.error('Error fetching presentations:', error);
      });
  }, [isFocused]);

  function renderPresentationCard(presentation) {
    const { prestype, presvenue, presdate, prestime, presspecialization } = presentation;

    const formattedPresDate = new Date(presdate).toLocaleDateString('en-GB', {
      weekday: 'long',
    });

    const formattedPresTime = new Date(`2000-01-01T${prestime}Z`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      

    return (
      <TouchableOpacity
        style={styles.presentationContainer}
        //onPress={() => navigation.navigate('')}
        >
        <View
          style={[
            styles.presTypeContainer,
            {
              backgroundColor: '#2459B7',
            },
          ]}
        >
          <Text style={styles.presType}>{prestype}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Venue:</Text>
          <Text style={styles.value}>{presvenue}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Specialization:</Text>
          <Text style={styles.value}>{presspecialization}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formattedPresDate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{formattedPresTime}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {fetchedPresentations.map(renderPresentationCard)}
      
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 0,
  },
  presTypeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  presType: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  presentationContainer: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    padding: 12,
    marginTop: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#212529',
  },
  value: {
    flex: 2,
    fontSize: 13,
    color: '#212529',
  },
});