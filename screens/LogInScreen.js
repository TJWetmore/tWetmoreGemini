import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';

const LogInScreen = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // I'm sending along the transaction history and current balance as params to the home screen, so that when the user loads up that screen, the data is already there. I'd like to hear your thoughts on the security of such a measure. I don't foresee any security issues - in the off chance that there's something akin to an injection attack - that the balance and the transaction history could be immediately profitable to a malicous third party. This isn't cold storage, afterall.
  const getUserData = async () => {
    setLoading(true);
    const userResult = await fetch(
      `http://jobcoin.gemini.com/justifier-excursion/api/addresses/${userName}`,
    );
    const returnedUserData = await userResult.json();
    // added logic for an ID that doesn't exist, I need to say no...
    // If there is no user, we should have a sign-up page, but that's beyond scope...
    // And why doesn't the API ever return 404? So the check needs to be if transactions.length > 0;
    if (returnedUserData.transactions.length > 0) {
      setLoginError('');
      navigate('Account', {
        user: userName,
        balance: returnedUserData.balance,
        transactions: returnedUserData.transactions,
      });
      setLoading(false);
    } else {
      setLoginError("User doesn't exist!");
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer} accessibilityLabel="Login Screen">
      <Text style={styles.text}>Enter Your ID:</Text>

      <TextInput
        style={styles.input}
        onChangeText={setUserName}
        value={userName}
        accessibilityLabel="Login Text Input"
      />
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            accessibilityLabel="Log In Loading Button"
          />
        ) : (
          <Button
            title="Go To Your Account"
            color="#008B8B"
            onPress={() => getUserData()}
            accessibilityLabel="Login Button"
          />
        )}
        {loginError.length > 0 && (
          <Text style={styles.errorText}>{loginError}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  input: {
    height: 40,
    marginVertical: 5,
    marginHorizontal: 10,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  },
  text: {
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'white',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
});

export default LogInScreen;
