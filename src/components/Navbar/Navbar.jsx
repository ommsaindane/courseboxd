import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';

const NavbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#1f1f1f',
  padding: theme.spacing(2, 4),
  color: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 10,
}));

const Logo = styled(Typography)({
  fontSize: 24,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#90caf9',
  },
});

const NavItems = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
});

const NavItem = styled(Typography)({
  cursor: 'pointer',
  fontSize: 16,
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#90caf9',
    transform: 'translateY(-2px)',
  },
});

const Dropdown = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: theme.spacing(1),
  backgroundColor: '#2a2a2a',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  overflow: 'hidden',
  zIndex: 100,
}));

const DropdownItem = styled(Box)({
  padding: '10px 16px',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 0.2s',
  '&:hover': {
    backgroundColor: '#3a3a3a',
  },
});

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <NavbarWrapper>
      <Box onClick={() => navigate('/home')}>
        <Logo>Courseboxd</Logo>
      </Box>

      <NavItems>
        <Box
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
          sx={{ position: 'relative' }}
        >
          <NavItem>{username}</NavItem>

          <AnimatePresence>
            {dropdownOpen && (
              <Dropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownItem onClick={() => navigate('/profile')}>Profile</DropdownItem>
                <DropdownItem onClick={() => navigate('/my-courses')}>Courses</DropdownItem>
                <DropdownItem onClick={() => navigate('/my-reviews')}>Reviews</DropdownItem>
                <DropdownItem onClick={() => navigate('/activity')}>Activity</DropdownItem>
                <DropdownItem onClick={() => navigate('/settings')}>Settings</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/');
                  }}
                >
                  Logout
                </DropdownItem>
              </Dropdown>
            )}
          </AnimatePresence>
        </Box>

        <NavItem onClick={() => navigate('/home')}>Home</NavItem>
        <NavItem onClick={() => navigate('/watchlist')}>Watchlist</NavItem>

        <Box sx={{ position: 'relative' }}>
          <NavItem
            onClick={() => setShowSearch((prev) => !prev)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
            }}
          >
            <SearchIcon fontSize="medium" />
          </NavItem>

          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 200 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  overflow: 'hidden',
                  backgroundColor: '#2a2a2a',
                  borderRadius: 4,
                  padding: '6px 10px',
                }}
              >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setShowSearch(false);
                  }
                }}
                placeholder="Search courses..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  width: '100%',
                }}
              />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </NavItems>
    </NavbarWrapper>
  );
};

export default Navbar;
