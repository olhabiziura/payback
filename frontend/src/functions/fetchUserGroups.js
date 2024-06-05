import api from '../../api';
import React, { useEffect, useState } from 'react';

const userGroups = async () => {
  try {
    const response = await api.get('user-groups/');
    const groups = response.data.groups;
    console.log(groups)
    return groups;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }
};

export default userGroups;
