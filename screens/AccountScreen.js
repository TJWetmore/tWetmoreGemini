/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const defaultChartData = {
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
};

const AccountScreen = ({ navigation: { navigate }, route }) => {
  const { user, balance, transactions } = route.params;

  const [userName, setUserName] = useState(user);
  const [userBalance, setUserBalance] = useState(balance);
  const [userTransactions, setUserTransactions] = useState(transactions);
  const [chartData, setChartData] = useState(defaultChartData);

  const [userDestination, setUserDestination] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  const [isLoadingTransactionHistory, setIsLoadingTransactionHistory] =
    useState(true);

  let balanceOverTime = [];
  let timeLine = [];

  const dateOptions = { month: 'short', day: 'numeric' };

  const getTransactionHistory = async () => {
    userTransactions.forEach((el) => {
      let d = new Date(el.timestamp).toLocaleDateString('en-US', dateOptions);

      if (el.toAddress === userName && balanceOverTime.length !== 0) {
        const addedAmount =
          balanceOverTime[balanceOverTime.length - 1] + Number(el.amount);
        balanceOverTime.push(addedAmount);
        timeLine.push(d);
      }
      if (el.toAddress === userName && balanceOverTime.length === 0) {
        balanceOverTime.push(Number(el.amount));
        timeLine.push(d);
      }
      if (el.fromAddress === userName) {
        const lessAmount =
          balanceOverTime[balanceOverTime.length - 1] - Number(el.amount);
        balanceOverTime.push(lessAmount);
        timeLine.push(d);
      }
    });

    balanceOverTime.push(balanceOverTime[balanceOverTime.length - 1]);
    timeLine.push(new Date().toLocaleDateString('en-US', dateOptions));

    setChartData({ ...chartData, labels: timeLine });

    setChartData({ ...chartData, datasets: [{ data: balanceOverTime }] });

    setIsLoadingTransactionHistory(false);
  };

  useEffect(() => {
    getTransactionHistory();
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // I considered abstracting this out, along with some of the other functions, as they're called more than once. Probably what should be done...
  const getUserData = async () => {
    const userResult = await fetch(
      `http://jobcoin.gemini.com/justifier-excursion/api/addresses/${userName}`,
    );
    const returnedUserData = await userResult.json();
    setUserBalance(returnedUserData.balance);
    setUserTransactions(returnedUserData.transactions);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(async () => {
      // eslint-disable-next-line no-unused-vars
      const userData = await getUserData();
      // eslint-disable-next-line no-unused-vars
      const transactionHistory = await getTransactionHistory();
      setIsRefreshing(false);
    }, 1000);
  };

  const handleJobCoinSend = () => {
    setUserDestination('');
    setSendAmount('');
    navigate('Confirming Payment', {
      user: userName,
      userDestination: userDestination,
      sendAmount: sendAmount,
    });
  };

  return (
    <ScrollView
      style={styles.homeScreenContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.dividerText}>Balance</Text>
      <View
        style={{
          borderBottomColor: '#008B8B',
          borderBottomWidth: 3,
        }}
      />
      <Text style={styles.balanceText}>{userBalance}</Text>
      <Text style={styles.balanceDescription}>job coins</Text>
      <View
        style={{
          borderBottomColor: '#008B8B',
          borderBottomWidth: 3,
          marginTop: 5,
        }}
      />
      <Text style={styles.dividerText}>Balance History</Text>
      {isLoadingTransactionHistory ? (
        <ActivityIndicator size="large" id="Chart Loading Screen" />
      ) : (
        <LineChart
          data={chartData}
          width={screenWidth}
          height={350}
          verticalLabelRotation={90}
          chartConfig={chartConfig}
          yLabelsOffset={2}
          bezier
        />
      )}
      <Text style={styles.dividerText}>Send JobCoins</Text>
      <View
        style={{
          borderBottomColor: '#008B8B',
          borderBottomWidth: 3,
          marginBottom: 5,
        }}
      />
      <Text style={styles.sendJCText}>Enter Destination:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserDestination}
        value={userDestination}
      />
      <Text style={styles.sendJCText}>Enter Amount:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setSendAmount}
        value={sendAmount}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleJobCoinSend()}
      >
        <Text style={styles.buttonText}>Send JobCoins</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  homeScreenContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginBottom: 40,
  },
  balanceText: {
    color: '#008B8B',
    fontSize: 100,
    flexGrow: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  balanceDescription: {
    color: '#008B8B',
    flexGrow: 0,
    textAlign: 'center',
  },
  dividerText: {
    padding: 10,
    backgroundColor: 'white',
    color: 'teal',
    textAlign: 'center',
    fontSize: 24,
    flexGrow: 3,
    fontWeight: 'bold',
  },
  sendJCText: {
    textAlign: 'center',
    backgroundColor: 'white',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    marginVertical: 5,
    marginHorizontal: 10,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    marginBottom: 30,
    backgroundColor: '#008B8B',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
});

const chartConfig = {
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#008B8B',
  },
};

export default AccountScreen;
