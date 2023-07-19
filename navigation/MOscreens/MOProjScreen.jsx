import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';

const Tab = createMaterialTopTabNavigator();

function renderProjectDetails(project) {
  const { projid, projectpostedby, projecttitle, projecttype, projectspecialization, studentassigned, moderatorassigned, projectstatus } = project;
  let backgroundColor = '';

  if (projectstatus === 'Pending') {
    backgroundColor = 'orange';
  } else if (projectstatus === 'Accepted') {
    backgroundColor = 'green';
  } else if (projectstatus === 'Declined') {
    backgroundColor = 'red';
  }

  const isAcceptedTab = projectstatus === 'Accepted';
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      key={projid}
      style={styles.projectContainer}
      onPress={() => navigation.navigate('MOProjInfoScreen', { project })}
    >
      <View
        style={[
          styles.projectIDContainer,
          {
            backgroundColor,
          },
        ]}
      >
        <Text style={styles.projectID}>{projid}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Proposed by:</Text>
        <Text style={styles.value}>{projectpostedby}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Project Title:</Text>
        <Text style={styles.value}>{projecttitle}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Project Type:</Text>
        <Text style={styles.value}>{projecttype}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Specialization:</Text>
        <Text style={styles.value}>{projectspecialization}</Text>
      </View>

      {isAcceptedTab && project.numofstudents === 1 && (
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{project.student[0].name}</Text>
        </View>
      )}

      {isAcceptedTab && project.numofstudents === 1 && (
        <View style={styles.row}>
          <Text style={styles.label}>Student Email:</Text>
          <Text style={styles.value}>{project.student[0].email}</Text>
        </View>
      )}

      {isAcceptedTab && project.numofstudents === 2 &&(
        <View style={styles.row}>
          <Text style={styles.label}>Student 1 Name:</Text>
          <Text style={styles.value}>{project.student[0].name}</Text>
        </View>
      )}

      {isAcceptedTab && project.numofstudents === 2 &&(
        <View style={styles.row}>
          <Text style={styles.label}>Student 1 Email:</Text>
          <Text style={styles.value}>{project.student[0].email}</Text>
        </View>
      )}

      {isAcceptedTab && project.numofstudents === 2 &&(
        <View style={styles.row}>
          <Text style={styles.label}>Student 2 Name:</Text>
          <Text style={styles.value}>{project.student[1].name}</Text>
        </View>
      )}

      {isAcceptedTab && project.numofstudents === 2 &&(
        <View style={styles.row}>
          <Text style={styles.label}>Student 2 Email:</Text>
          <Text style={styles.value}>{project.student[0].email}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function MOProjScreen({navigation}) {
  const [fetchedProjects, setFetchedProjects] = useState([]);
  const isFocused = useIsFocused(); // Get the focused state of the screen
  const { user } = useContext(AuthContext); // Access the accid from the AuthContext

  useEffect(() => {
    fetch('http://3.26.23.172/projects')
      .then((response) => response.json())
      .then((data) => {
        setFetchedProjects(data); // Update the fetchedProjects state
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, [isFocused]);
  
  function Ass_StuScreen() {
    const acceptedProjects = fetchedProjects.filter((proj) => proj.projectstatus === 'Accepted' && proj.moderator_id === user?.accid);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {acceptedProjects.map((project) => renderProjectDetails(project))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container2}>
      <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 13,
          textTransform: 'none',
        },
        tabBarstyle: {
          backgroundColor: '#f2f2f2',
        },
        tabBarindicatorStyle: {
          backgroundColor: '#0038FF',
        },
      }}>
      <Tab.Screen name="Assigned Student" component={Ass_StuScreen} />
      </Tab.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 80,
    paddingHorizontal: 8,
  },
  projectContainer: {
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
  container2: {
    flex: 1,
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

export default MOProjScreen;
