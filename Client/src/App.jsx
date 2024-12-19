import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true); // Default dark mode enabled

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setCaption('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/caption', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCaption(response.data.caption);
    } catch (err) {
      setError('Error generating caption. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <h1>Image Caption Generator</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="toggle-button">
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </header>
      <div
        {...getRootProps()}
        className="dropzone"
      >
        <input {...getInputProps()} />
        <p>{file ? file.name : 'Drag & drop an image, or click to select one'}</p>
      </div>
      <button onClick={handleUpload} disabled={loading || !file} className="upload-button">
        {loading ? 'Generating...' : 'Generate Caption'}
      </button>
      {caption && <p className="caption">Caption: {caption}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
