import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const TransferSafety = ({ navigation: { navigate }, route }) => {
  const { user, userDestination, sendAmount } = route.params;

  const [showIcon, setShowIcon] = useState(false);
  const [errors, setShowErrors] = useState(false);

  //this function should be in a separate file that we import to this file...
  const fetchUpdatedProfile = async () => {
    const userResult = await fetch(
      `http://jobcoin.gemini.com/justifier-excursion/api/addresses/${user}`,
    );
    const returnedUserData = await userResult.json();
    setShowIcon(true);
    setTimeout(function () {
      if (userResult.ok) {
        navigate('Account', {
          user: user,
          balance: returnedUserData.balance,
          transactions: returnedUserData.transactions,
        });
      } else {
        navigate('Login');
      }
    }, 1000);
  };

  // sending JC function. I have some delays on here just so everything isn't instantaenous.
  const sendJobCoins = async () => {
    try {
      await fetch(
        'http://jobcoin.gemini.com/justifier-excursion/api/transactions',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromAddress: user,
            toAddress: userDestination,
            amount: sendAmount,
          }),
        },
      );
      setTimeout(() => {
        fetchUpdatedProfile();
      }, 2000);
    } catch (error) {
      setShowErrors(true);

      setTimeout(() => {
        navigate('Account', { user: user });
        setShowErrors(false);
      }, 2000);
    }
  };

  useEffect(() => {
    sendJobCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = <ActivityIndicator size="large" />;
  const iconDisplay = <Text style={styles.icon}> 👍</Text>;
  const errorDisplay = <Text style={styles.icon}> Did not send :(</Text>;

  return (
    <View style={styles.safetyContainer}>
      {showIcon ? iconDisplay : loading}
      {errors && errorDisplay}
    </View>
  );
};

const styles = StyleSheet.create({
  safetyContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default TransferSafety;
