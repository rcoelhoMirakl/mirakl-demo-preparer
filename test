import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const synchronizeCategories = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/categories/synchros`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': process.env.REACT_APP_FRONT_KEY,
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

  return (
    <div className="App">
      <h1>Mirakl Demo Preparer</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={synchronizeCategories}>Sync Categories</button>
    </div>
  );
}

export default App;
