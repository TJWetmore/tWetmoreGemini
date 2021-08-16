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

// default Chart data so page doesn't crash on initial render (it won't given that I have that ternery statement but... just to be safe)
const defaultChartData = {
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
};

const AccountScreen = ({ navigation: { navigate }, route }) => {
  let { user, balance, transactions } = route.params;

  // Taking state from params so I can manipulate it later
  const [userName, setUserName] = useState(user);
  const [userBalance, setUserBalance] = useState();
  const [userTransactions, setUserTransactions] = useState(transactions);
  const [chartData, setChartData] = useState(defaultChartData);

  // tracking input from text entry
  const [userDestination, setUserDestination] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  // Fail-safe loading bar incase we have a time intensive transaction history
  const [isLoadingTransactionHistory, setIsLoadingTransactionHistory] =
    useState(true);

  useEffect(() => {
    setUserBalance(balance);
    setUserTransactions(transactions);
    setTimeout(() => {
      getTransactionHistory();
    }, 2000);
  }, [route.params]);

  // function to manipulate the transaction data for our user
  const getTransactionHistory = () => {
    const balanceOverTime = [];
    const timeLine = [];
    const dateOptions = { month: 'short', day: 'numeric' };
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

    //optional, giving the current balance and time on the chart...
    balanceOverTime.push(balanceOverTime[balanceOverTime.length - 1]);
    timeLine.push(new Date().toLocaleDateString('en-US', dateOptions));

    setChartData({ ...chartData, labels: timeLine });
    setChartData({ ...chartData, datasets: [{ data: balanceOverTime }] });
    setIsLoadingTransactionHistory(false);
  };

  // everytime the user jumps into this screen we update the balance and transactions

  // I considered abstracting this out, along with some of the other functions, as they're called more than once. Probably what should be done...

  const getUserData = async () => {
    const userResult = await fetch(
      `http://jobcoin.gemini.com/justifier-excursion/api/addresses/${userName}`,
    );
    const returnedUserData = await userResult.json();
    setUserBalance(returnedUserData.balance);
    setUserTransactions(returnedUserData.transactions);
  };

  //another ternery to show the refershing wheel at the top of the page
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const userData = await getUserData();
    const transactionHistory = await getTransactionHistory();
    setIsRefreshing(false);
  };

  const handleJobCoinSend = () => {
    navigate('Confirming Payment', {
      user: userName,
      userDestination: userDestination,
      sendAmount: sendAmount,
    });
    setUserDestination('');
    setSendAmount('');
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
