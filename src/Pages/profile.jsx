import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  TextField,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Settings from '@mui/icons-material/Settings';
import Reviews from '@mui/icons-material/RateReview';
import PlaylistPlay from '@mui/icons-material/PlaylistPlay';
import MenuBook from '@mui/icons-material/MenuBook';
import TimelineIcon from '@mui/icons-material/Timeline';

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#121212',
  color: '#fff',
  padding: theme.spacing(6, 4),
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(5),
}));

const InfoBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const UploadIcon = styled('label')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: '#90caf9',
  borderRadius: '50%',
  padding: 4,
  cursor: 'pointer',
}));

const TabPanel = ({ value, index, children }) => {
  return value === index && (
    <Box sx={{ mt: 4 }}>
      {children}
    </Box>
  );
};

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const token = storedUser?.token;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [avatar, setAvatar] = useState(null);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUsername(data.user.username || '');
          setEmail(data.user.email || '');
        } else {
          console.error(data.error || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <PageWrapper>
      <HeaderSection>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatar}
            sx={{ width: 100, height: 100, fontSize: 36, bgcolor: '#90caf9' }}
          >
            {!avatar && username?.[0]?.toUpperCase()}
          </Avatar>
          <UploadIcon htmlFor="avatar-upload">
            <PhotoCamera fontSize="small" />
            <input
              type="file"
              accept="image/*"
              hidden
              id="avatar-upload"
              onChange={handleAvatarChange}
            />
          </UploadIcon>
        </Box>

        <InfoBox>
          <TextField
            label="Username"
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: '#90caf9' },
                '&.Mui-focused fieldset': { borderColor: '#90caf9' },
              },
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: '#90caf9' },
                '&.Mui-focused fieldset': { borderColor: '#90caf9' },
              },
            }}
          />
        </InfoBox>
      </HeaderSection>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: '1px solid #333',
          '& .MuiTab-root': { color: '#ccc' },
          '& .Mui-selected': { color: '#90caf9' },
        }}
      >
        <Tab icon={<MenuBook />} iconPosition="start" label="My Courses" />
        <Tab icon={<PlaylistPlay />} iconPosition="start" label="Watchlist" />
        <Tab icon={<Reviews />} iconPosition="start" label="Reviews" />
        <Tab icon={<TimelineIcon />} iconPosition="start" label="Activity" />
        <Tab icon={<Settings />} iconPosition="start" label="Settings" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <Typography>List of your enrolled courses.</Typography>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Typography>Your watchlist goes here.</Typography>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Typography>Your reviews will be shown here.</Typography>
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <Typography>Track your learning activity here.</Typography>
      </TabPanel>
      <TabPanel value={tabIndex} index={4}>
        <Typography>Adjust your settings and preferences.</Typography>
      </TabPanel>
    </PageWrapper>
  );
};

export default Profile;
