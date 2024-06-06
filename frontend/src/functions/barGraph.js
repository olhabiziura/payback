import React, { useEffect, useState } from 'react';
import api from "../../api";

function BarGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/graph-data/`);
        const fetchedData = response.data;
        
        // Transform the fetched data into the desired format
        const transformedData = fetchedData.map(item => ({
          name: item.name,
          value: item.amount
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      console.log(data)
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount.
``
  return data;
}

export default BarGraph;
