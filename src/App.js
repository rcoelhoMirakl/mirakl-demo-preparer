import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {
  const [environment, setEnvironment] = useState('');
  const [operatorKey, setOperatorKey] = useState('');
  const [frontKey, setFrontKey] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const synchronizeCategories = async () => {
    if (!file || !environment || !frontKey || !operatorKey) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = `https://${environment}.mirakl.net`;

    try {
      const response = await axios.post(
        `${apiUrl}/api/categories/synchros`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': frontKey,
          },
        }
      );

      console.log('Synchronization successful:', response.data);
      alert('Synchronization successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('Synchronization failed. Please check the console for details.');
    }
  };

  const getTaxonomy = async () => {
    if (!environment || !frontKey) {
      alert('Please fill in all fields.');
      return;
    }

    const apiUrl = `https://${environment}.mirakl.net`;

    try {
      const [categoriesRes, valueListsRes, attributesRes] = await Promise.all([
        axios.get(`${apiUrl}/api/hierarchies`, {
          headers: { 'Accept': 'application/json', 'Authorization': frontKey },
        }),
        axios.get(`${apiUrl}/api/values_lists`, {
          headers: { 'Accept': 'application/json', 'Authorization': frontKey },
        }),
        axios.get(`${apiUrl}/api/products/attributes`, {
          headers: { 'Accept': 'application/json', 'Authorization': frontKey },
        }),
      ]);

      const categories = categoriesRes.data;
      const valueLists = valueListsRes.data;
      const attributes = attributesRes.data;

      const workbook = XLSX.utils.book_new();
      const categoriesSheet = XLSX.utils.json_to_sheet(categories);
      const valueListsSheet = XLSX.utils.json_to_sheet(valueLists);
      const attributesSheet = XLSX.utils.json_to_sheet(attributes);

      XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');
      XLSX.utils.book_append_sheet(workbook, valueListsSheet, 'Value Lists');
      XLSX.utils.book_append_sheet(workbook, attributesSheet, 'Attributes');

      XLSX.writeFile(workbook, 'taxonomy.xlsx');
      alert('Taxonomy file has been downloaded!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get taxonomy data. Please check the console for details.');
    }
  };

  return (
    <div className="App">
      <h1>Mirakl Demo Preparer</h1>
      <div>
        <label>
          Environment:
          <input type="text" value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="e.g., demo, prod" />
        </label>
      </div>
      <div>
        <label>
          Operator Key:
          <input type="text" value={operatorKey} onChange={(e) => setOperatorKey(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Front Key:
          <input type="text" value={frontKey} onChange={(e) => setFrontKey(e.target.value)} />
        </label>
      </div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={synchronizeCategories}>Sync Categories</button>
      <button onClick={getTaxonomy}>Get Taxonomy</button>
    </div>
  );
}

export default App;
