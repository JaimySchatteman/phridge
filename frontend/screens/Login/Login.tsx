import React, { Component, FC, useState } from 'react';
import { Alert, Button, TextInput, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

const Login: FC = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const onLogin = async () => {
    const formData = new FormData();
    formData.append('email', 'John');
    formData.append('password', 'John123');
    formData.append('first_name', 'John');
    formData.append('last_name', 'John123');

    const response = await fetch('http://192.168.0.254:5000/register', {
      method: 'POST',
      body: formData,
    });

    const formData2 = new FormData();
    formData.append('email', 'John');
    formData.append('password', 'John123');

    const response2 = await fetch('http://192.168.0.254:5000/login', {
      method: 'POST',
      body: formData2,
    });
    const data = await response.json();
    const data2 = await response2.json();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={newEmail => setEmail(email)}
        placeholder="Username"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={newPassword => setPassword(newPassword)}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={onLogin} />
    </View>
  );
};

export default Login;
