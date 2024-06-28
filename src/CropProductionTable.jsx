// src/CropProductionTable.js
import React, { useEffect, useState } from 'react';
import data from './data.json'; // Import the JSON file

const CropProductionTable = () => {
  const [processedData, setProcessedData] = useState([]);
  const [cropAverages, setCropAverages] = useState([]);

  useEffect(() => {
    const processCropData = (data) => {
      const yearResults = {};
      const cropData = {};

      data.forEach((entry) => {
        const year = entry.Year.split(',').pop().trim();
        const crop = entry['Crop Name'];
        const production = entry['Crop Production (UOM:t(Tonnes))'];
        const yieldValue = parseFloat(entry['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']);
        const area = parseFloat(entry['Area Under Cultivation (UOM:Ha(Hectares))']);

        if (!production) return;

        const productionValue = parseFloat(production);

        // Calculate max and min production per year
        if (!yearResults[year]) {
          yearResults[year] = {
            maxCrop: crop,
            maxProduction: productionValue,
            minCrop: crop,
            minProduction: productionValue,
          };
        } else {
          if (productionValue > yearResults[year].maxProduction) {
            yearResults[year].maxCrop = crop;
            yearResults[year].maxProduction = productionValue;
          }
          if (productionValue < yearResults[year].minProduction) {
            yearResults[year].minCrop = crop;
            yearResults[year].minProduction = productionValue;
          }
        }

        // Accumulate data for average calculations
        if (!cropData[crop]) {
          cropData[crop] = {
            totalYield: yieldValue || 0,
            totalArea: area || 0,
            count: yieldValue && area ? 1 : 0,
          };
        } else {
          if (yieldValue) cropData[crop].totalYield += yieldValue;
          if (area) cropData[crop].totalArea += area;
          if (yieldValue && area) cropData[crop].count += 1;
        }
      });

      const processed = Object.entries(yearResults).map(([year, { maxCrop, maxProduction, minCrop, minProduction }]) => ({
        year,
        maxCrop,
        maxProduction,
        minCrop,
        minProduction,
      }));

      const averages = Object.entries(cropData).map(([crop, { totalYield, totalArea, count }]) => ({
        crop,
        averageYield: (totalYield / count).toFixed(2),
        averageArea: (totalArea / count).toFixed(2),
      }));

      setProcessedData(processed);
      setCropAverages(averages);
    };

    processCropData(data);
  }, []);

  return (
    <div>
    <div className='' style={{display:"flex"}}>
      <h1>Crop Production Table</h1>
      <h1 className='' style={{marginTop:"30px",marginLeft:"30px",fontSize:"20px"}}><a href="#cropAvgTable">Table 2 Crop Average Table</a> </h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Crop with Maximum Production</th>
            <th>Maximum Production (Tonnes)</th>
            <th>Crop with Minimum Production</th>
            <th>Minimum Production (Tonnes)</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((entry) => (
            <tr key={entry.year}>
              <td>{entry.year}</td>
              <td>{entry.maxCrop}</td>
              <td>{entry.maxProduction}</td>
              <td>{entry.minCrop}</td>
              <td>{entry.minProduction}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 id='cropAvgTable'>Crop Averages Table</h1>
      <table>
        <thead>
          <tr>
            <th>Crop</th>
            <th> Average Yield (Kg/Ha) of Crop between 1950-2020</th>
            <th>Average Cultivation Area(Ha)
of the Crop between
1950-2020</th>
          </tr>
        </thead>
        <tbody>
          {cropAverages.map((entry) => (
            <tr key={entry.crop}>
              <td>{entry.crop}</td>
              <td>{entry.averageYield}</td>
              <td>{entry.averageArea}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CropProductionTable;
