import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';

const ListOfStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://3.26.23.172/students')
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
        setStudents(sortedData);
      })
      .catch(error => console.log(error));
  }, []);

  const renderHeader = () => (
    <View style={styles.row}>
      <Text style={styles.header}>Name</Text>
      <Text style={styles.header}>Email</Text>
      <Text style={styles.projidHeader}>Project ID</Text>
    </View>
  );

  const renderStudentItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.projidCell}>{item.projid}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Students List</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderHeader()}
        <FlatList
          data={students}
          renderItem={renderStudentItem}
          keyExtractor={item => item.stuid.toString()}
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
  projidHeader: {
    flex: 1,
    fontSize: 15,
    color: '#212529',
    textAlign: 'center', // Center align the text
  },
});

const ListOfStudentsScreen = ({ navigation }) => {
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

  return <ListOfStudents />;
};

export default ListOfStudentsScreen;
