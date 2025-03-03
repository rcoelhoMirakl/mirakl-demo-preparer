import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [environment, setEnvironment] = useState('');
  const [operatorKey, setOperatorKey] = useState('');
  const [frontKey, setFrontKey] = useState('');
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [valueLists, setValueLists] = useState([]);

  const getTaxonomy = async () => {
    if (!environment || !frontKey || !operatorKey) {
      alert('Please fill in all fields.');
      return;
    }

    const apiUrl = 'http://localhost:3001/api';  // Using the proxy server

    try {
      const [categoriesRes, valueListsRes, attributesRes] = await Promise.all([
        axios.get(`${apiUrl}/hierarchies`, {
          headers: { 'Authorization': frontKey },
        }),
        axios.get(`${apiUrl}/values_lists`, {
          headers: { 'Authorization': frontKey },
        }),
        axios.get(`${apiUrl}/products/attributes`, {
          headers: { 'Authorization': frontKey },
        }),
      ]);

      setCategories(categoriesRes.data);
      setValueLists(valueListsRes.data);
      setAttributes(attributesRes.data);

      alert('Taxonomy data retrieved!');
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
          <input type="text" value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="e.g., demo" />
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
      <button onClick={getTaxonomy}>Get Taxonomy</button>

      {/* Displaying the data */}
      <div>
        <h2>Categories</h2>
        <pre>{JSON.stringify(categories, null, 2)}</pre>
      </div>
      <div>
        <h2>Attributes</h2>
        <pre>{JSON.stringify(attributes, null, 2)}</pre>
      </div>
      <div>
        <h2>Value Lists</h2>
        <pre>{JSON.stringify(valueLists, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
