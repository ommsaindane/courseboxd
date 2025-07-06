import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <Box sx={{ padding: 4, color: '#fff' }}>
      <Typography variant="h4">Search results for "{query}"</Typography>
      {loading ? (
        <CircularProgress sx={{ marginTop: 4 }} />
      ) : results.length > 0 ? (
        <Box mt={3}>
          {results.map((course, idx) => (
            <Box key={idx} sx={{ mb: 2, borderBottom: '1px solid #444', pb: 2 }}>
              <Typography variant="h6">{course.title}</Typography>
              <Typography variant="body2">{course.platform} — {course.price}</Typography>
              <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ color: '#90caf9' }}>
                View Course
              </a>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" mt={3}>No results found.</Typography>
      )}
    </Box>
  );
};

export default SearchPage;
