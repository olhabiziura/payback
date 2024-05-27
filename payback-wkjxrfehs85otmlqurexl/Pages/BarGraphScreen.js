import React from 'react';
import { View, Text } from 'react-native';
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
      fill: item.value > 0 ? 'green' : 'red',
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
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {item.name}
      </SvgText>
    ))
  );

  return (
    <View style={styles.container}>
      <HeaderBar 
        navigation={navigation} 
        goBack={true} 
        person={true} 
        home={true} 
        bars={true} 
        question={true} 
      />
      <View style={styles.container_main}>
        <Text style={styles.title}>Debt Overview</Text>
        <View style={styles.container_chart}>
          <BarChart
            style={styles.barChart}
            data={barData}
            horizontal={false}
            contentInset={styles.contentInset}
            spacingInner={0.2}
            yAccessor={({ item }) => item.value}
          >
            <Grid direction={Grid.Direction.VERTICAL} />
            <CustomLabels />
          </BarChart>
        </View>
      </View>
    </View>
  );
};

export default BarGraphScreen;
