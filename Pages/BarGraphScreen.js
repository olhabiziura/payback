import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import api from '../api';
import { Platform, StatusBar } from "react-native";
import { Button } from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;
const maxBarHeight = screenHeight / 3.75;

const BarGraphScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isEmptyData, setIsEmptyData] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          filter: 'all',
        };
        const response = await api.get('/api/graph-data/', { params });
        const fetchedData = response.data;

        const transformedData = fetchedData.map(item => ({
          label: item.name,
          value: parseFloat(item.amount),
        }));
        setData(transformedData);

        setIsEmptyData(transformedData.length === 0);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);


  const handleBarPress = (amount) => {
    
    navigation.navigate('Payment Page');

  };

  if (isEmptyData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar style={styles.header_container} navigation={navigation} goBack={false} person={true} home={true} bars={true} question={true} title={'Total Balance'} />
        <View style={styles.containerMain}>
          <Text style={styles.title}>Today you are balanced out!</Text>
          <Image source={require('../assets/images/happy_panda.png')} style={styles.image} />
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Groups')}
            style={styles.button}
          >
            Groups
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const maxValue = Math.max(...data.map(item => Math.abs(item.value)));

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar style={styles.header_container} navigation={navigation} goBack={false} person={true} home={false} bars={true} question={true} notifications= {true} title={'Total Balance'} />
    
      <View style={styles.containerMain}>
      <Text style={styles.text}>Welcome To Payback!</Text>
        <View style={styles.graphFrame}>
          <ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
            <View style={styles.graphContainer}>
              <View style={styles.zeroLine} />
              {data
                .filter(item => item.value !== 0)
                .map((item, index) => {
                  let barHeight = (Math.abs(item.value) / maxValue) * maxBarHeight;
                  if (barHeight <= 50) {
                    barHeight = 50;
                  }
                  return (
                    <TouchableOpacity onPress={() => handleBarPress(item.value)} >
                    <View key={index} style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            backgroundColor: item.value >= 0 ? '#2471A3' : '#ff5733',
                            height: barHeight,
                            marginTop: item.value >= 0 ? maxBarHeight - barHeight : maxBarHeight,
                            marginBottom: item.value < 0 ? maxBarHeight - barHeight : maxBarHeight,
                          },
                        ]}
                      >
                      
                      <View>

                        <Text style={styles.value}>{item.value}</Text>
                        <Text style={styles.label}>{item.label}</Text>
                      </View>
                      </View>

                      
                    </View>
                    </TouchableOpacity>
                    
                  );
                })}
                
            </View>
          </ScrollView>
        </View>
      </View>
      <CustomButton
        title="Groups"
        onPress={() => navigation.navigate('Groups')}
        titleColor="black"
        backgroundColor="#e7e7e7"
        icon="people-outline"
      />
    </SafeAreaView>
  );
};

const CustomButton = ({ title, onPress, titleColor, backgroundColor, icon }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={() => {
      animateButton();
      onPress();
    }} activeOpacity={0.8}>
      <Animated.View style={[styles.button, { backgroundColor, transform: [{ scale: scaleValue }] }]}>
        <View style={styles.buttonContent}>
          <Icon name={icon} size={24} color={titleColor} style={styles.icon} />
          <Text style={[styles.buttonText, { color: titleColor }]}>{title}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
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
    flex: 1,
  },
  title: {
    marginBottom: 40,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  graphFrame: {
    borderWidth: 8,
    borderColor: '#d3d3d3',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 20,
    width: '95%',
    alignItems: 'center',
    flex: 1,
  },
  horizontalScroll: {
    alignItems: 'center',
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
  },
  barContainer: {
    marginRight: 5,
    alignItems: 'center',
  },
  bar: {
    width: 70,
    justifyContent: 'flex-end',
    borderRadius: 10,
    
    
  },
  label: {
    textAlign: 'center',
    color: 'white',
    marginTop: 0,
  },
  value: {
    textAlign: 'center',
    color: 'white',
    padding: 0,
  
  },
  zeroLine: {
    position: 'absolute',
    top: maxBarHeight ,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'black',
  },
  image: {
    width: 150,
    height: 150,
  },
  button: {
    width: 280,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginVertical: 15,
    backgroundColor: '#e7e7e7',
    alignSelf: "center",
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default BarGraphScreen;
