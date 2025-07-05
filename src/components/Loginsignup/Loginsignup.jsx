import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(10),
  backgroundColor: '#2c2c2c',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  color: '#fff',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
}));

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: 24,
});

const Title = styled(Typography)({
  fontSize: 32,
  fontWeight: 'bold',
  marginBottom: 8,
});

const Underline = styled(Box)({
  width: 60,
  height: 4,
  backgroundColor: '#90caf9',
  margin: '0 auto',
  borderRadius: 2,
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'gray',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: '#90caf9',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#90caf9',
    },
  },
}));

const ForgotPassword = styled(Typography)({
  marginTop: 12,
  textAlign: 'right',
  color: '#90caf9',
  fontSize: 14,
  cursor: 'pointer',
});

const SubmitContainer = styled(Box)({
  marginTop: 32,
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledButton = styled(Button)(({ theme }) => ({
  width: '48%',
}));

const Message = styled(Typography)({
  marginTop: 20,
  color: 'white',
});

const Loginsignup = () => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMsg, setResponseMsg] = useState('');

  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = action === "Login" ? '/api/login' : '/api/signup';

    const payload = {
      email,
      password,
      ...(action === "Sign Up" && { username })
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({
          token: data.token,
          user: data.user
        }));
        setResponseMsg(data.message);
        navigate('/home');
      } else {
        setResponseMsg(data.error || "Something went wrong");
      }
    } catch (err) {
      setResponseMsg("Server error");
    }
  };

  const handleActionClick = (selectedAction) => {
    if (selectedAction === action) {
      handleSubmit();
    } else {
      setAction(selectedAction);
      setResponseMsg('');
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return setResetMsg("Please enter your email");

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();
      setResetMsg(res.ok ? data.message : data.error || "Something went wrong");
    } catch (err) {
      setResetMsg("Server error");
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Title>{action}</Title>
          <Underline />
        </Header>

        {action === "Sign Up" && (
          <StyledTextField
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <StyledTextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <StyledTextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {action === "Login" && (
          <ForgotPassword onClick={() => setShowForgotPopup(true)}>
            Forgot password?
          </ForgotPassword>
        )}

        <SubmitContainer>
          <StyledButton
            variant={action === "Login" ? "outlined" : "contained"}
            onClick={() => handleActionClick("Sign Up")}
            color="primary"
          >
            Sign Up
          </StyledButton>
          <StyledButton
            variant={action === "Sign Up" ? "outlined" : "contained"}
            onClick={() => handleActionClick("Login")}
            color="primary"
          >
            Login
          </StyledButton>
        </SubmitContainer>

        {responseMsg && (
          <Message>{responseMsg}</Message>
        )}
      </Container>

      {/* Forgot Password Popup */}
      <Dialog open={showForgotPopup} onClose={() => setShowForgotPopup(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter your email"
            type="email"
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          {resetMsg && <Typography color="error">{resetMsg}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPassword} color="primary">
            Send Reset Link
          </Button>
          <Button
            onClick={() => {
              setShowForgotPopup(false);
              setResetEmail('');
              setResetMsg('');
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Loginsignup;
