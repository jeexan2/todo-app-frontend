import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [taskGroups, setTaskGroups] = useState([]);

  useEffect(() => {
    const loadTaskGroups = async () => {
      try {
        const storedTaskGroups = await AsyncStorage.getItem('taskGroups');
        if (storedTaskGroups !== null) {
          setTaskGroups(JSON.parse(storedTaskGroups));
        }
      } catch (error) {
        console.error('Failed to load task groups.', error);
      }
    };

    loadTaskGroups();
  }, []);

  useEffect(() => {
    const saveTaskGroups = async () => {
      try {
        await AsyncStorage.setItem('taskGroups', JSON.stringify(taskGroups));
      } catch (error) {
        console.error('Failed to save task groups.', error);
      }
    };

    saveTaskGroups();
  }, [taskGroups]);

  const addTaskGroup = () => {
    setTaskGroups([...taskGroups, { id: Date.now().toString(), name: 'New Task Group', tasks: [] }]);
  };

  const removeTaskGroup = (id) => {
    setTaskGroups(taskGroups.filter(group => group.id !== id));
  };

  const updateTaskGroupName = (id, newName) => {
    setTaskGroups(taskGroups.map(group => group.id === id ? { ...group, name: newName } : group));
  };

  const renderTaskGroup = ({ item }) => (
    <View style={styles.taskGroup}>
      <TextInput
        style={styles.taskGroupName}
        value={item.name}
        onChangeText={(text) => updateTaskGroupName(item.id, text)}
      />
      <TouchableOpacity onPress={() => removeTaskGroup(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>-</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={taskGroups}
        renderItem={renderTaskGroup}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity onPress={addTaskGroup} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  taskGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  taskGroupName: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
