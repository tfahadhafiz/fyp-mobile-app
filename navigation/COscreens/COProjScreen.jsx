import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

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
      onPress={() => navigation.navigate('COProjInfoScreen', { project })}
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

      {isAcceptedTab && (
        <View style={styles.row}>
          <Text style={styles.label}>Student Status:</Text>
          <Text style={styles.value}>{studentassigned}</Text>
        </View>
      )}

      {isAcceptedTab && (
        <View style={styles.row}>
          <Text style={styles.label}>Moderator Status:</Text>
          <Text style={styles.value}>{moderatorassigned}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function COProjScreen() {
  const [fetchedProjects, setFetchedProjects] = useState([]);
  const isFocused = useIsFocused(); 

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
  
  function Proj_PendScreen() {
    const pendingProjects = fetchedProjects.filter((proj) => proj.projectstatus === "Pending");

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {pendingProjects.map((project) => renderProjectDetails(project))}
      </ScrollView>
    );
  }

  function Proj_AccScreen() {
    const acceptedProjects = fetchedProjects.filter((proj) => proj.projectstatus === 'Accepted');

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {acceptedProjects.map((project) => renderProjectDetails(project))}
      </ScrollView>
    );
  }

  function Proj_DecScreen() {
    const declinedProjects = fetchedProjects.filter((proj) => proj.projectstatus === 'Declined');

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {declinedProjects.map((project) => renderProjectDetails(project))}
      </ScrollView>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 13,
          textTransform: 'none',
        },
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#0038FF',
        },
      })}
    >
      <Tab.Screen name="Pending" component={Proj_PendScreen} />
      <Tab.Screen name="Accepted" component={Proj_AccScreen} />
      <Tab.Screen name="Declined" component={Proj_DecScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 10,
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
});

export default COProjScreen;