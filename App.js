import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Keyboard, AsyncStorage, Platform, KeyboardAvoidingView, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

export default function App() {
  const [task, setTask] = useState([])//salva lista de tarefas
  const [newTask, setNewTask] = useState('') // salva os dados do input

  async function addTask() {

    //Verifica se o objeto esta vazio

    if (newTask === '') {
      return;
    }


    const search = task.filter(task => task === newTask)

    // Verifica se tem alguma tarefa igual 
    if (search.length !== 0) {
      Alert.alert("Atenção", "Nome da tarefa repetido")
      return;
    }

    //Renderiza a lista em tela
    setTask([...task, newTask])
    setNewTask('')

    // Remove o declado apos adicionar 
    Keyboard.dismiss()
  }

  async function removeTask(item) {

    Alert.alert(
      'Deletar Tarefa',
      'Tem certeza que deseja remover a tarefa? ',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return;
          },
          style: 'cancel'
        },
        {
          text: 'Ok',
          onPress: () => setTask(task.filter(tasks => tasks !== item))
        }
      ],
      { cancelable: false }
    )
  }

  /* TESTE DE CARACTERES DIGITADOS NO ONCHANGTEXT DO INPUT
  
    useEffect(() => {
      console.log(newTask);
  
    }, [newTask]) 
    
    */

  useEffect(() => {
    async function loadingDados() {
      const task = await AsyncStorage.getItem('task')
      if(task){
        setTask(JSON.parse(task))
      }
    }
    loadingDados()
  }, [])



  useEffect(() => {
    async function saveDados() {
      AsyncStorage.setItem('task', JSON.stringify(task))
    }
    saveDados()
  }, [task])

  return (
    <>
      <View style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={0}
          behavior='padding'
          style={{ flex: 1 }}
          enabled={true}
        >
          <View style={styles.Body}>
            <FlatList
              style={styles.FlatList}
              data={task}
              keyExtractor={item => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.ContainerView} >
                  <Text style={styles.TextView} >{item}</Text>

                  <TouchableOpacity
                    onPress={() => removeTask(item)}
                  >
                    <MaterialIcons
                      name='delete-forever'
                      size={35}
                      color='#a30016' />
                  </TouchableOpacity>

                </View>
              )}
            >

            </FlatList>
          </View>
          <View style={styles.Form}>
            <TextInput
              style={styles.Input}
              autoCorrect={true}
              placeholder="Adicione uma nova tarefa !!"
              maxLength={50}
              placeholderTextColor="#999"
              onChangeText={text => setNewTask(text)}
              value={newTask}
            />
            <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
              <Ionicons name="md-checkmark-circle" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#959da6',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 0,
    borderTopWidth: 30,// verificar 
  },

  Body: {
    flex: 1

  },
  Form: {
    padding: 0,
    height: 60,
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#959da6',
    /*     padding: 0,
        height: 60,
        alignSelf: 'stretch',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 13,
        borderTopWidth: 20,
        borderColor: '#eee' */
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft: 10,

  },
  FlatList: {
    flex: 1,
    marginTop: 5,
    fontSize: 16

  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: 'center',


  },
  TextView: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
    textAlign: 'center',


  }


});
