import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useTheme,
  Paper,
  Avatar,
  Divider,
  Chip,
  Fade,
  Grow,
  IconButton,
  alpha,
  Card,
  CardContent,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ProcurementIcon,
  LocalShipping as ShippingIcon,
  Login as LoginIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon,
  BarChart as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as PerformanceIcon,
  KeyboardArrowDown as ScrollIcon,
} from '@mui/icons-material';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: 'Inventory Management',
      description: 'Track stock levels, manage product categories, and receive low stock alerts.',
      icon: <InventoryIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
    },
    {
      title: 'Procurement Processing',
      description: 'Create purchase orders, manage suppliers, and track order status.',
      icon: <ProcurementIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
    },
    {
      title: 'Shipment Tracking',
      description: 'Manage outbound shipments, generate shipping documents, and track delivery status.',
      icon: <ShippingIcon sx={{ fontSize: 60, color: theme.palette.success.main }} />,
    },
  ];

  return (
    <Box>
      {/* Modern Hero Section with Animated Elements */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          pt: { xs: 10, md: 16 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: '50px',
          borderBottomRightRadius: '50px',
        }}
      >
        {/* Animated background elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      mb: 3,
                    }}
                  >
                    Modern Warehouse Management System
                  </Typography>
                  <Typography 
                    variant="h5" 
                    paragraph 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 400,
                      opacity: 0.9,
                      maxWidth: '90%',
                      lineHeight: 1.5,
                    }}
                  >
                    Streamline your inventory, optimize operations, and boost productivity with our comprehensive solution.
                  </Typography>
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                      onClick={() => navigate('/login')}
                      startIcon={<LoginIcon />}
                      sx={{ 
                        py: 1.5, 
                        px: 3,
                        borderRadius: 2,
                        fontWeight: 600,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      onClick={() => scrollToSection('features')}
                      sx={{ 
                        py: 1.5, 
                        px: 3,
                        borderRadius: 2,
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    <Chip 
                      label="Inventory Tracking" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.15)', 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                      }} 
                    />
                    <Chip 
                      label="Order Management" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.15)', 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                      }} 
                    />
                    <Chip 
                      label="Analytics" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.15)', 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                      }} 
                    />
                    <Chip 
                      label="Shipping" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.15)', 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                      }} 
                    />
                  </Box>
                </Box>
              </Fade>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Grow in={true} timeout={1500} style={{ transformOrigin: '50% 50% 0' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Warehouse Management"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: 'perspective(1000px) rotateY(-10deg)',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg)',
                    }
                  }}
                />
              </Grow>
            </Box>
          </Stack>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 8,
            opacity: scrolled ? 0 : 0.7,
            transition: 'opacity 0.3s ease',
          }}>
            <IconButton 
              color="inherit"
              onClick={() => scrollToSection('features')}
              sx={{ 
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '40%': {
                    transform: 'translateY(-20px)',
                  },
                  '60%': {
                    transform: 'translateY(-10px)',
                  },
                },
              }}
            >
              <ScrollIcon fontSize="large" />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Features Section with Modern Design */}
      <Box 
        id="features" 
        sx={{ 
          py: { xs: 10, md: 15 },
          background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute',
          top: '5%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: alpha(theme.palette.primary.light, 0.05),
          filter: 'blur(80px)',
          zIndex: 0,
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: '10%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: alpha(theme.palette.secondary.light, 0.05),
          filter: 'blur(100px)',
          zIndex: 0,
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Powerful Features
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                paragraph 
                sx={{ 
                  mb: 3, 
                  maxWidth: 800, 
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Our warehouse management system provides everything you need to streamline your operations and boost productivity.
              </Typography>
              <Divider sx={{ width: '80px', mx: 'auto', mb: 6, borderWidth: 3, borderColor: theme.palette.primary.main }} />
            </Box>
          </Fade>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            {features.map((feature, index) => (
              <Box sx={{ width: { xs: '100%', md: '33.33%' } }} key={index}>
                <Grow in={true} timeout={1000 + (index * 300)} style={{ transformOrigin: 'center top' }}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        '& .feature-icon-wrapper': {
                          transform: 'scale(1.1)',
                        },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '5px',
                        background: index === 0 
                          ? theme.palette.primary.main 
                          : index === 1 
                            ? theme.palette.secondary.main 
                            : theme.palette.success.main,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4, textAlign: 'center' }}>
                      <Box 
                        className="feature-icon-wrapper"
                        sx={{ 
                          mb: 3,
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          background: index === 0 
                            ? alpha(theme.palette.primary.main, 0.1) 
                            : index === 1 
                              ? alpha(theme.palette.secondary.main, 0.1) 
                              : alpha(theme.palette.success.main, 0.1),
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          color: index === 0 
                            ? theme.palette.primary.main 
                            : index === 1 
                              ? theme.palette.secondary.main 
                              : theme.palette.success.main,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Box>
            ))}
          </Stack>
          
          {/* Additional feature highlights */}
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Fade in={true} timeout={1500}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  mb: 5,
                }}
              >
                Why Choose Our Solution?
              </Typography>
            </Fade>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mt: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
                <Fade in={true} timeout={1500}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      height: '100%',
                      borderRadius: 4,
                      background: alpha(theme.palette.primary.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        color: theme.palette.primary.main,
                        width: 60,
                        height: 60,
                        mb: 2,
                        mx: 'auto',
                      }}
                    >
                      <DashboardIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      User-Friendly
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Intuitive interface designed for all skill levels
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
              
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
                <Fade in={true} timeout={1700}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      height: '100%',
                      borderRadius: 4,
                      background: alpha(theme.palette.secondary.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                        color: theme.palette.secondary.main,
                        width: 60,
                        height: 60,
                        mb: 2,
                        mx: 'auto',
                      }}
                    >
                      <AnalyticsIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Advanced Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detailed reports and actionable insights
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
              
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
                <Fade in={true} timeout={1900}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      height: '100%',
                      borderRadius: 4,
                      background: alpha(theme.palette.success.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1), 
                        color: theme.palette.success.main,
                        width: 60,
                        height: 60,
                        mb: 2,
                        mx: 'auto',
                      }}
                    >
                      <PerformanceIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      High Performance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fast and reliable even with large inventories
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
              
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
                <Fade in={true} timeout={2100}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      height: '100%',
                      borderRadius: 4,
                      background: alpha(theme.palette.warning.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.warning.main, 0.1), 
                        color: theme.palette.warning.main,
                        width: 60,
                        height: 60,
                        mb: 2,
                        mx: 'auto',
                      }}
                    >
                      <SecurityIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Enterprise Security
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Advanced protection for your sensitive data
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 10 }}>
        <Container maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 6, 
              borderRadius: 4, 
              textAlign: 'center',
              background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              Login to your account and start managing your warehouse operations efficiently.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/login')}
              sx={{ 
                py: 1.5, 
                px: 5,
                borderRadius: 2,
                fontSize: '1.1rem',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-3px)',
                },
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              Login Now
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography variant="h6" gutterBottom>
                Warehouse Management System
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                A comprehensive solution for all your warehouse management needs.
              </Typography>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} Warehouse Management System. All rights reserved.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
