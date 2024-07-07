import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';

const TaskGroup = ({ group, onRemove, onNameChange }) => {
  return (
    <View style={styles.taskGroup}>
      <TextInput
        style={styles.taskGroupText}
        value={group.name}
        onChangeText={(text) => onNameChange(group.id, text)}
        placeholder="Enter Task Group Name"
      />
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(group.id)}>
        <AntDesign name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [taskGroups, setTaskGroups] = useState([{ id: 1, name: '' }, { id: 2, name: '' }]);

  const addTaskGroup = () => {
    setTaskGroups([...taskGroups, { id: taskGroups.length + 1, name: '' }]);
  };

  const removeTaskGroup = (id) => {
    setTaskGroups(taskGroups.filter(group => group.id !== id));
  };

  const changeTaskGroupName = (id, newName) => {
    const updatedGroups = taskGroups.map(group =>
      group.id === id ? { ...group, name: newName } : group
    );
    setTaskGroups(updatedGroups);
  };

  const renderTaskGroup = ({ item }) => (
    <TaskGroup
      group={item}
      onRemove={removeTaskGroup}
      onNameChange={changeTaskGroupName}
    />
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={taskGroups}
        renderItem={renderTaskGroup}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.taskList}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTaskGroup}>
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  taskList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  taskGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8c471',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5b041',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  taskGroupText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    backgroundColor: '#58d68d',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
