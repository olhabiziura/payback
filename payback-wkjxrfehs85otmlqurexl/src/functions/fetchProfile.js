
import React, { useState } from 'react';


function ProfileScreen  () {
    const [name, setName] = useState('John');
    const [surname, setSurname] = useState('Doe');
    const [paymentDetails, setPaymentDetails] = useState('IBAN: 123456789');
    
    const [friends, setFriends] = useState([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ]);
    const [expenses, setExpenses] = useState([
      { id: '1', description: 'Groceries', amount: 50, date: '2024-05-01' },
      { id: '2', description: 'Dinner', amount: 100, date: '2024-05-02' },
      { id: '3', description: 'Transport', amount: 20, date: '2024-05-03' },
    ]);
    return [name,setName,surname,setSurname, paymentDetails,setPaymentDetails,friends,setFriends,expenses,setExpenses];
}
export default ProfileScreen;