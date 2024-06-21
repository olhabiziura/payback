import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Platform, StatusBar } from "react-native";

const styles = StyleSheet.create({
    container :{
        flexGrow: 1,
        height : 'auto',
        justifyContent: 'center',
        paddingHorizontal: 0,
        padding: 16,
        backgroundColor : '#F4F4F4',

    },
    container_main: {
      flexGrow: 1,
      height: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    header_container:{
        height: '10%',
      },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
      },
    input: {
        height: '7%',
        width: '90%',
        borderColor: '#ccc',
        borderWidth: 2,
        marginBottom: '5%',
        paddingHorizontal: '30%',
        textAlign: 'center',
        borderRadius : 15,

      },
      imageSmall:{
        width: 30,
        height: 40,
        borderRadius: 35,
      },
      imageBig: {
        width: 320,
        height: 440,
        borderRadius: 18,
      },
      imageMedium: {
        width : 200,
        height : 200,
        alignItems : 'right',
        marginVertical : 20,
        paddingTop : 120,
        paddingBottom: 100,
        borderRadius: 25, // Set the border radius to half of width and height to make it round
        borderWidth: 3,
        borderColor: 'white',
      },
      content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
      },
      logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
      },
     /* title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      }, */
      description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
      },
    
    socialButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
      },
    
    
    subTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 0,
    },
    
    expenseItem: {
      padding: 10,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    expenseDescription: {
      fontSize: 16,
    },
    expenseAmount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    expenseDate: {
      fontSize: 16,
      fontStyle: 'italic',
    },
    sortPicker: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      height: 100,
    },
    picker: {
      height :100,
      marginTop: 20,
      marginBottom: 110,
      width: '80%',
    },
    expensesList: {
      marginBottom: 10,
      width: '100%',
    },
    friendItem: {
      padding: 10,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
    },
    friendsList: {
      marginBottom: 20,
      width: '100%',
    },
    container_chart: {
      flexDirection: 'row',
      height: '70%',
      paddingVertical: 30,
    },
    contentInset: {
      top: 30,
      bottom: 30,
    },
    yAxisSvg: {
      fill: 'black',
      fontSize: 12,
    },
    barChart: {
      flex: 1,
      marginLeft: 8,
      
    },
    rightActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
    },
    buttonContainer: {
      marginTop: 20, // Adjust the margin top to lower the buttons
    },
    groupName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    
    groupContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      paddingHorizontal: 20,
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#ccc',
      backgroundColor: '#f9f9f9',
    },
    safeArea: {
      flex: 1,
      backgroundColor: '#F4F4F4',
      paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
    },

  });
export default styles;