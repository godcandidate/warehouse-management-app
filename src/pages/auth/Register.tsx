import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person as PersonIcon,
  Email as EmailIcon,
  Password as PasswordIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  HowToReg as HowToRegIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  phoneNumber: string;
  role: string;
}

const steps = ['Account Information', 'Personal Details', 'Company Information'];

const Register: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      phoneNumber: '',
      role: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      // In a real app, you would call the register API here
      // For now, we'll use login since register isn't implemented in the auth context
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch {
      // Error is handled by the auth context
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: 'First name is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  autoComplete="given-name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              rules={{
                required: 'Last name is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  autoComplete="family-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />

            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                pattern: {
                  value: /^[0-9+-]+$/,
                  message: 'Invalid phone number',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  autoComplete="tel"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />
          </>
        );
      case 2:
        return (
          <>
            <Controller
              name="companyName"
              control={control}
              rules={{
                required: 'Company name is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  autoComplete="organization"
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{
                required: 'Role is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Your Role"
                  variant="outlined"
                  fullWidth
                  autoComplete="organization-title"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: '16px',
          padding: '32px',
          background: 'white',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <form 
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '70px',
              height: '70px',
              borderRadius: '20px',
              background: `linear-gradient(135deg, #7c4dff 0%, #4f0d7c 100%)`,
              marginBottom: '24px',
              boxShadow: `0 10px 20px ${alpha('#7c4dff', 0.2)}`,
            }}
          >
            <HowToRegIcon sx={{ color: 'white', fontSize: 36 }} />
          </div>
              
          <Typography variant="h4" component="h1" fontWeight="bold" align="center" gutterBottom>
            Create Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" style={{ marginBottom: '24px' }}>
            Step {activeStep + 1} of 3: {steps[activeStep]}
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', marginBottom: '32px' }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {renderStepContent(activeStep)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', width: '100%' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ 
                visibility: activeStep === 0 ? 'hidden' : 'visible',
                color: '#333',
                '&:hover': {
                  backgroundColor: alpha('#1976d2', 0.05),
                }
              }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />}
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, #7c4dff 0%, #4f0d7c 100%)`,
                  boxShadow: `0 8px 20px ${alpha('#7c4dff', 0.3)}`,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 10px 25px ${alpha('#7c4dff', 0.4)}`,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, #1976d2 0%, #7c4dff 100%)`,
                  boxShadow: `0 8px 20px ${alpha('#1976d2', 0.3)}`,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 10px 25px ${alpha('#1976d2', 0.4)}`,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>

          <div style={{ width: '100%', textAlign: 'center', margin: '24px 0', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: 0, 
              right: 0, 
              height: '1px', 
              background: '#e0e0e0' 
            }} />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                display: 'inline-block', 
                position: 'relative', 
                background: 'white', 
                padding: '0 16px' 
              }}
            >
              OR
            </Typography>
          </div>

          <div style={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2" 
                sx={{ fontWeight: 600 }}
                underline="hover"
                color="#1976d2"
              >
                Sign in
              </Link>
            </Typography>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
