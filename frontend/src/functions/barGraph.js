import React from 'react';
import { View } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
import * as scale from 'd3-scale';

const BarGraph = ({ data, screenWidth }) => {
  // Transform and validate data
  const transformedData = data.map(item => ({
    name: item.name,
    value: isNaN(parseFloat(item.value)) ? 0 : parseFloat(item.value),
  }));

  // Determine colors based on value
  const colors = transformedData.map(item => (item.value >= 0 ? 'green' : 'red'));

  return (
    <View style={{ height: 300, width: screenWidth, padding: 10 }}>
      <BarChart
        style={{ flex: 1 }}
        data={transformedData}
        yAccessor={({ item }) => item.value}
        xAccessor={({ item }) => item.name}
        contentInset={{ top: 30, bottom: 30 }}
        svg={{ fill: 'green' }}
        spacingInner={0.2}
        gridMin={Math.min(...transformedData.map(item => item.value)) - 10}
        gridMax={Math.max(...transformedData.map(item => item.value)) + 10}
        xScale={scale.scaleBand}
      >
        <Grid />
        {transformedData.map((item, index) => (
          <SvgText
            key={index}
            x={(index * screenWidth) / transformedData.length + screenWidth / (2 * transformedData.length)}
            y={item.value >= 0 ? 20 : 280}
            fontSize={14}
            fill={colors[index]}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {`${item.name} (${item.value})`}
          </SvgText>
        ))}
      </BarChart>
    </View>
  );
};

export default BarGraph;
