import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';

export default function SUMeetScreen({ navigation }) {
  const [fetchedMeetings, setFetchedMeetings] = useState([]);
  const isFocused = useIsFocused(); // Get the focused state of the screen
  const { user } = useContext(AuthContext); // Access the accid from the AuthContext

  useEffect(() => {
    fetch('http://3.26.23.172/meetings')
      .then((response) => response.json())
      .then((data) => {
        const filteredMeetings = data.filter((meeting) => meeting.supervisor_id === user?.accid); // Filter meetings based on supervisor_id
        setFetchedMeetings(filteredMeetings); // Update the fetchedMeetings state with filtered meetings
      })
      .catch((error) => {
        console.error('Error fetching meetings:', error);
      });
  }, [isFocused, user?.accid]);

  function renderMeetingCard(meeting) {
    const { projid, name, projecttitle, meetdate, meettime } = meeting;

    const formattedMeetDate = new Date(meetdate).toLocaleDateString('en-US', {
      weekday: 'long',
    });

    const dayName = formattedMeetDate.split(',')[0];

    const formattedMeetTime = new Date(`2000-01-01T${meettime}Z`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return (
      <TouchableOpacity
        key={projid}
        style={styles.meetingContainer}
        onPress={() => navigation.navigate('SUMeetWeekScreen', { meeting })}
        >
        <View
          style={[
            styles.projectIDContainer,
            {
              backgroundColor: '#2459B7',
            },
          ]}
        >
          <Text style={styles.projectID}>{name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Project Title:</Text>
          <Text style={styles.value}>{projecttitle}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Meeting Date:</Text>
          <Text style={styles.value}>{dayName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Meeting Time:</Text>
          <Text style={styles.value}>{formattedMeetTime}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {fetchedMeetings.map((meeting) => renderMeetingCard(meeting))}
      
      </ScrollView>

      <TouchableOpacity onPress={() => navigation.navigate('SUMeetCreateScreen')} style={styles.addButton}>
        <Ionicons name="ios-add" size={52} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 0,
  },
  projectIDContainer: {
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
  projectID: {
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
    paddingBottom: 86,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  meetingContainer: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    padding: 12,
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
  addButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#243DB7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
