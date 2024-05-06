import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/urls');
      setShortenedUrls(response.data);
    } catch (error) {
      setError('Error fetching URLs. Please try again later.');
      console.error('Error fetching URLs:', error);
    }
  };

  const handleShorten = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/shorten', { originalUrl });
      setShortenedUrls([...shortenedUrls, response.data]);
      setOriginalUrl(''); // Clear input after successful submission
    } catch (error) {
      setError('Error shortening URL. Please try again.');
      console.error('Error shortening URL:', error);
    }
  };

  const handleUrlClick = async (url) => {
    try {
      // Update the click count
      const updatedClicks = url.clicks + 1;
      await axios.put(`http://localhost:5000/api/url/${url._id}`, { clicks: updatedClicks });
      // Navigate to the original URL
      window.location.href = url.originalUrl;
    } catch (error) {
      console.error('Error accessing shortened URL:', error);
    }
  };

  return (
    <div style={{ 
      maxWidth: '100vw',
      maxHeight: '100vh',
      margin: '0 auto', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      background: 'linear-gradient(to bottom, #001e50, #007bff)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>URL Shortener</h1>
      {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          style={{ flex: '1', padding: '8px', border: '1px solid #ccc', borderRadius: '10px', marginRight: '10px' }}
          type="text"
          placeholder="Enter URL to shorten"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button
          style={{ padding: '8px 16px', backgroundColor: '#4dff4d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          onClick={handleShorten}
        >
        <div style={{color:'black'}}>
          Shorten
          </div>
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '4px'}}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Original URL</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Shortened URL</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {shortenedUrls.map((url) => (
            <tr key={url._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{url.originalUrl}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <a
                  style={{ textDecoration: 'none', color: '#007bff', cursor: 'pointer' }}
                  href={`/${url.shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleUrlClick(url)}
                >
                  {url.shortUrl}
                </a>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{url.clicks}</td> {/* Display clicks count */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
