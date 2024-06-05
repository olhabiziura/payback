import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import { Text as SvgText } from 'react-native-svg';
import BarGraph from '../src/functions/barGraph';
import styles from '../assets/styles/MainContainer';

const BarGraphScreen = ({ navigation }) => {

  const data = BarGraph();

  const barData = data.map(item => ({
    value: item.value,
    svg: {
      fill: item.value > 0 ? '#629BB6' : '#DF8F48',
    },
    key: `bar-${item.name}`,
    name: item.name,
  }));

  const CustomLabels = ({ x, y, bandwidth, data }) => (
    data.map((item, index) => (
      <SvgText
        key={index}
        x={x(index) + (bandwidth / 2)}
        y={item.value > 0 ? y(item.value) - 10 : y(item.value) + 20}
        fontSize={14}
        fill="black"
        alignmentBaseline="mathematical"
        textAnchor="middle"
      >
        {item.name}
      </SvgText>
    ))
  );

  const CustomValueLabels = ({ x, y, bandwidth, data }) => (
    data.map((item, index) => (
      <SvgText
        key={index}
        x={x(index) + (bandwidth / 2)}
        y={item.value > 0 ? y(item.value) - 25 : y(item.value) + 5}
        fontSize={14}
        fill="black"
        alignmentBaseline="mathematical"
        textAnchor="middle"
      >
        {item.value}
      </SvgText>
    ))
  );

  return (
    <View style={stylesa.safeArea}>
      <HeaderBar 
        style={stylesa.header_container}
        navigation={navigation} 
        goBack={true} 
        person={true} 
        home={true} 
        bars={true} 
        question={true} 
      />
      <Text style={stylesa.title}>Debt Overview</Text>
      <ScrollView contentContainerStyle={stylesa.scrollViewContent}>
        <View style={stylesa.container_main}>
          <ScrollView horizontal style={stylesa.horizontalScrollView}>
            <BarChart
              style={stylesa.barChart}
              data={barData}
              yAccessor={({ item }) => item.value}
              contentInset={{ top: 30, bottom: 30 }}
              spacingInner={0.2}
            >
              <Grid direction={Grid.Direction.VERTICAL} />
              <CustomLabels x={(d) => d} y={(d) => d} bandwidth={(d) => d} data={barData} />
              <CustomValueLabels x={(d) => d} y={(d) => d} bandwidth={(d) => d} data={barData} />
            </BarChart>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const stylesa = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom : 100,
  },
  container_main: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingLeft: '29%',
  },
  horizontalScrollView: {
    width: '100%',
  },
  container_chart: {
    height: 200,
    marginVertical: 10,
  },
  barChart: {
    height: 500,
    width: 700,
    padding: 10, // Adjust this width as necessary to fit your data
  },
  contentInset: {
    top: 20,
    bottom: 20,
  },
});

export default BarGraphScreen;
