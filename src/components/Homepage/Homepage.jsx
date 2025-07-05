import React from 'react';
import Navbar from '../Navbar/Navbar';
import SplitText from '../SplitText/SpiltText';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#121212',
  color: '#fff',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  fontSize: '1.5rem',
}));

const courses = [
  {
    id: 1,
    title: 'React for Beginners',
    progress: 70,
    image: 'https://source.unsplash.com/400x200/?react,code'
  },
  {
    id: 2,
    title: 'Intro to Python',
    progress: 40,
    image: 'https://source.unsplash.com/400x200/?python,programming'
  },
  {
    id: 3,
    title: 'Web Development Bootcamp',
    progress: 85,
    image: 'https://source.unsplash.com/400x200/?web,developer'
  }
];

const Homepage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.user?.username || "User";

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <PageWrapper>
      <Navbar username={username} />
      <ContentWrapper>
        <Box textAlign="center">
          <SplitText
            text={`Welcome back, ${username}`}
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </Box>

        <SectionTitle>Continue Learning</SectionTitle>
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ backgroundColor: '#1f1f1f', color: '#fff' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.image}
                  alt={course.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="gray" gutterBottom>
                    Progress: {course.progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: '#333',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#90caf9',
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default Homepage;
