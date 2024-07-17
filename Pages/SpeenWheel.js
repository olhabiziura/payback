// SpinWheelGame.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, Animated, Easing, TextInput, FlatList, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Circle, G, Line, Text as SVGText, Svg } from 'react-native-svg';
import HeaderBar from '../components/HeaderBar';
import ChosenNamePopup from '../components/ChosenNamePopUp';
const screenHeight = Dimensions.get('window').height;
const maxBarHeight = screenHeight / 3.75;

const SpinWheel = ({ names, onSpinEnd }) => {
  const [spinning, setSpinning] = useState(false);
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
        const sectorIndex = Math.floor(Math.random() * names.length);
        const result = names[sectorIndex];
        onSpinEnd(result);
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
    <View style={styles.spinWheelContainer}>
      <View style={styles.spinWheelFrame}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Svg width="300" height="300">
            {names.length > 0 ? (
              names.map((name, index) => {
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
              })
            ) : (
              <Circle cx="150" cy="150" r="100" fill="none" stroke="black" strokeWidth="1" />
            )}
          </Svg>
        </Animated.View>
      </View>
      <View style={styles.indicator}>
        <Line x1="150" y1="0" x2="150" y2="50" stroke="black" strokeWidth="4" />
        <Line x1="145" y1="40" x2="155" y2="40" stroke="black" strokeWidth="4" />
      </View>
      <Button title="Spin" onPress={spinWheel} disabled={spinning || names.length === 0} />
      {spinning && <Text style={styles.spinningText}>Spinning...</Text>}
    </View>
  );
};

const SpinWheelGame = ({ navigation }) => {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState('');
  const [chosenName, setChosenName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const addName = () => {
    if (newName.trim() !== '') {
      setNames([...names, newName.trim()]);
      setNewName('');
    }
  };

  const deleteName = (nameToDelete) => {
    setNames(names.filter(name => name !== nameToDelete));
  };

  const clearGame = () => {
    setNames([]);
    setChosenName('');
    setShowPopup(false); // Close the popup if it's open
  };

  const handleSpinEnd = (result) => {
    setChosenName(result);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setChosenName('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter a name"
          value={newName}
          onChangeText={setNewName}
          onSubmitEditing={addName} // Add this line
        />
        <Button title="Add Name" onPress={addName} />
        <FlatList
          data={names}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => deleteName(item)} style={styles.nameItemContainer}>
              <Text style={styles.nameItem}>{item}</Text>
              <View style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.listContainer}
        />
        <SpinWheel names={names} onSpinEnd={handleSpinEnd} />
        <CustomButton title="Clear Game" onPress={clearGame} />
        {showPopup && <ChosenNamePopup chosenName={chosenName} onClose={closePopup} />}
      </View>
    </SafeAreaView>
  );
};

const CustomButton = ({ title, onPress }) => {
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
      <Animated.View style={styles.clearButton}>
        <Text style={styles.clearButtonText}>{title}</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  containerwheel: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 20,
    paddingHorizontal: 10,
    width: 200,
  },
  nameItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  nameItem: {
    padding: 5,
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  spinWheelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  spinWheelFrame: {
    borderWidth: 3,
    borderColor: '#d3d3d3',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 20,
    width: '95%',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 0,
  },
  spinningText: {
    marginTop: 10,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ff5733',
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SpinWheelGame;
