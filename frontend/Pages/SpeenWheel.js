import React, { useState, useEffect } from 'react';
import { View, Text, Button, Animated, Easing } from 'react-native';
import { Circle, G, Line, Text as SVGText, Svg } from 'react-native-svg';

const SpinWheel = ({ names }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const rotation = new Animated.Value(0);

  useEffect(() => {
    if (spinning) {
      rotation.setValue(0);
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        // Calculate the random sector index
        const sectorIndex = Math.floor(Math.random() * names.length);
        // Set the result to the name at the random sector index
        setResult(names[sectorIndex]);
        // Calculate the final rotation angle for the selected sector
        const finalRotation = (2 * Math.PI * sectorIndex) / names.length;
        rotation.setValue(finalRotation);
        setSpinning(false);
      });
    }
  }, [spinning]);
  
  const spinWheel = () => {
    setSpinning(true);
  };
  
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg width="300" height="300">
          {names.map((name, index) => {
            const startAngle = (index * 360) / names.length;
            const endAngle = ((index + 1) * 360) / names.length;
            return (
              <G key={index}>
                <Circle cx="150" cy="150" r="100" fill="none" stroke="black" strokeWidth="1" />
                <G transform={`rotate(${startAngle + 90} 150 150)`}>
                  <Line x1="150" y1="50" x2="150" y2="100" stroke="black" strokeWidth="2" />
                  <SVGText
                    x="150"
                    y="90"
                    fontSize="12"
                    textAnchor="middle"
                    transform={`rotate(${(endAngle - startAngle) / 2} 150 150)`}>
                    {name}
                  </SVGText>
                </G>
              </G>
            );
          })}
        </Svg>
      </Animated.View>
      <View style={{ position: 'relative', top: 0 }}>
        <Line x1="150" y1="20" x2="150" y2="40" stroke="black" strokeWidth="8" />
        <Line x1="150" y1="40" x2="145" y2="35" stroke="black" strokeWidth="2" />
        <Line x1="150" y1="40" x2="155" y2="35" stroke="black" strokeWidth="2" />
      </View>
      <Button title="Spin" onPress={spinWheel} disabled={spinning} />
      {spinning ? <Text>Spinning...</Text> : result ? <Text>Result: {result}</Text> : <Text>Press the button to spin the wheel</Text>}
    </View>
  );
}  
const SpinWheelGame = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Emma','Jacob'];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SpinWheel names={names} />
    </View>
  );
};

export default SpinWheelGame;
