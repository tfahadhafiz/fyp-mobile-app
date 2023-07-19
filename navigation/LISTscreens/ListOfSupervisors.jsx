import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';

const ListOfSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    fetch('http://3.26.23.172/view_users')
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(item => item.account_type === 'supervisor');
        const sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name));
        setSupervisors(sortedData);
      })
      .catch(error => console.log(error));
  }, []);

  const renderHeader = () => (
    <View style={styles.row}>
      <Text style={styles.header}>Name</Text>
      <Text style={styles.header}>Email</Text>
    </View>
  );

  const renderStaffItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Supervisors List</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderHeader()}
        <FlatList
          data={supervisors}
          renderItem={renderStaffItem}
          keyExtractor={item => item.accid.toString()}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: 0,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  header: {
    flex: 1,
    fontSize: 15,
    color: '#212529',
    //textAlign: 'center', // Center align the text
  },
  cell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#343a40',
    //textAlign: 'center', // Center align the text
  },
  projidCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text
    color: '#343a40',
  },
});

const ListOfSupervisorsScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: 'Records',
      headerStyle: {
        backgroundColor: '#243DB7',
      },
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerTintColor: '#fff',
    });
  }, []);

  return <ListOfSupervisors />;
};

export default ListOfSupervisorsScreen;
