import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import api from '../api';
import { Platform, StatusBar } from "react-native";

const screenHeight = Dimensions.get('window').height;
const maxBarHeight = screenHeight / 3;

const BarGraphScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isEmptyData, setIsEmptyData] = useState(true); // State to track if data is empty

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          filter: 'all',
        };
        const response = await api.get('/api/graph-data/', { params });
        const fetchedData = response.data;

        // Transform the fetched data into the desired format
        const transformedData = fetchedData.map(item => ({
          label: item.name, // Change 'name' to 'label' for better understanding
          value: parseFloat(item.amount), // Ensure value is a number
        }));
        setData(transformedData);

        // Check if data is empty
        setIsEmptyData(transformedData.length === 0);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  if (isEmptyData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar style={styles.header_container} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
        <View style={styles.containerMain}>
          <Text style={styles.title}>Today you are balanced out!</Text>
          <Image source={require('../assets/images/happy_panda (2).png')} style={styles.image} />
        </View>
      </SafeAreaView>
    );
  }

  // Find the maximum absolute value to scale the bars
  const maxValue = Math.max(...data.map(item => Math.abs(item.value)));

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar style={styles.header_container} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.containerMain}>
          <Text style={styles.title}>Bar Graph</Text>
          <ScrollView horizontal>
            <View style={styles.graphContainer}>
              {/* Draw zero line */}
              <View style={styles.zeroLine} />
              {data
                .filter(item => item.value !== 0) // Filter out items with value 0
                .map((item, index) => {
                  const barHeight = (Math.abs(item.value) / maxValue) * maxBarHeight;
                  return (
                    <View key={index} style={styles.barContainer}>
                      <Text style={[styles.value, item.value >= 0 ? styles.positiveValue : styles.negativeValue]}>
                        {item.value}
                      </Text>
                      <View
                        style={[
                          styles.bar,
                          {
                            backgroundColor: item.value >= 0 ? 'blue' : 'red',
                            height: barHeight,
                            marginTop: item.value >= 0 ? maxBarHeight - barHeight : maxBarHeight,
                            marginBottom: item.value < 0 ? maxBarHeight - barHeight : maxBarHeight,
                          },
                        ]}
                      />
                      <Text style={[styles.label, item.value >= 0 ? styles.positiveLabel : styles.negativeLabel]}>
                        {item.label}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  containerMain: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    marginBottom: 40,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  barContainer: {
    marginRight: 5,
    alignItems: 'center',
    marginBottom: 65,
  },
  bar: {
    width: 70,
  },
  label: {
    textAlign: 'center',
  },
  positiveLabel: {
    marginTop: 5,
  },
  negativeLabel: {
    marginBottom: 5,
  },
  value: {
    textAlign: 'center',
  },
  positiveValue: {
    marginBottom: 5,
  },
  negativeValue: {
    marginTop: 5,
  },
  zeroLine: {
    position: 'absolute',
    top: maxBarHeight + 21,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'black',
  },
  image: {
    width : 150,
    height : 150,
   
  },
});

export default BarGraphScreen;
