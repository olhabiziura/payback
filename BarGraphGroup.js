import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import api from '../api';
import { Platform, StatusBar } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';


const screenHeight = Dimensions.get('window').height;
const maxBarHeight = screenHeight / 3;

const BarGraphGroup = ({ navigation, route }) => {

  const {groupID, groupName} = route.params;

  const [data, setData] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [barWidth, setBarWidth ] =  useState(40); // Adjust the width of each bar as needed
  const maxBarHeight = screenHeight / 3; // Max height of bars

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          filter: "&groupId",
          groupId: groupID,
        };
        console.log(groupID)
        const response = await api.get('/api/graph-data/',{params});
        const fetchedData = response.data;

        // Transform the fetched data into the desired format
        const transformedData = fetchedData.map(item => ({
          label: item.name, // Change 'name' to 'label' for better understanding
          value: parseFloat(item.amount), // Ensure value is a number
        }));
        const maxLabelLength = Math.max(...transformedData.map(item => item.label.length));
        setBarWidth(maxLabelLength * 10); // Adjust multiplier as needed for spacing

        console.log(transformedData)
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);


  const handleBarPress = (amount) => {
    
    navigation.navigate('Payment Page');

  };

  if (data.length === 0) {
    return <Text>Loading...</Text>;
  }

  // Find the maximum absolute value to scale the bars
  const maxValue = Math.max(...data.map(item => Math.abs(item.value)));

  return (
    <SafeAreaView style={styles.safeArea}>
    
      <View style={styles.containerMain}>
      <Text style={styles.title}>Bar Graph for {groupName}</Text>
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
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: 20,
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
    color: '#2471A3',
  },
  graphFrame: {
    borderWidth: 2,
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
});

export default BarGraphGroup;
