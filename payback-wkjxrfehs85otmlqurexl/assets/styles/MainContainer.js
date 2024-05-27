import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const styles = StyleSheet.create({
    container :{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 0,
        padding: 16,
    },
    container_main: {
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
        height: '5%',
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 2,
        marginBottom: '5%',
        paddingHorizontal: '30%',
        textAlign: 'center',

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
        width: 200,
        height: 220,
        borderRadius: 15,
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
      marginBottom: 8,
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
      flex: 1,
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
  });
export default styles;