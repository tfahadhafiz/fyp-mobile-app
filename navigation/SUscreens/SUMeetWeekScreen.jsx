import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SUMeetWeekScreen({ route, navigation }) {
  const { meeting } = route.params; // Get the selected project from the navigation route
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Meeting',
      headerStyle: {
        backgroundColor: '#243DB7', // Customize the header background color
      },
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerTintColor: '#fff', // Customize the header text color
    });
  }, []);

  const handleWeekSelect = (week) => {
    setSelectedWeek(week);
    navigation.navigate('SUMeetWeekInputScreen', { week, meetId: meeting.meetid, studentName: meeting.name});
    // Navigate to the screen where you input meeting details for the selected week
    // Pass the selected week and route.params.meetId to the next screen
    // You can use a navigation library like react-navigation to navigate to the next screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Student: {meeting.name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ color: 'grey', fontSize: 12, textAlign: 'center', marginBottom: 20 }}>Select a Meeting Week</Text>
        <View style={styles.weekContainer}>
          {Array.from(Array(14), (_, index) => (
            <TouchableOpacity
              key={index}
              style={styles.weekItem}
              onPress={() => handleWeekSelect(index + 1)}
            >
              <View style={styles.weekItemContent}>
                <Ionicons name="people-outline" size={18} color="#212529" style={styles.weekItemIcon} />
                <Text style={styles.weekTitle}>Meeting Week {index + 1}</Text>
                <Ionicons name="chevron-forward" size={18} color="#212529" style={styles.weekItemIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  topBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#0038FF',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  topBarText: {
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 2,
    paddingHorizontal: 20,
  },
  weekContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  weekItem: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
  },
  weekItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekTitle: {
    flex: 1,
    fontSize: 13,
    color: '#212529',
    marginLeft: 0,
  },
  weekItemIcon: {
    marginRight: 8,
  },
  
});
