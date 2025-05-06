import React from 'react';
import { Button, useTheme, alpha } from '@mui/material';
import type { ButtonProps } from '@mui/material';

export type AppButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light';

interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: AppButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  size = 'medium',
  children,
  ...props
}) => {
  const theme = useTheme();

  // Define gradient colors for each variant
  const gradients = {
    primary: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    secondary: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    success: 'linear-gradient(90deg, #4CAF50 0%, #388E3C 100%)',
    warning: 'linear-gradient(90deg, #FF9800 0%, #F57C00 100%)',
    danger: 'linear-gradient(90deg, #F44336 0%, #D32F2F 100%)',
    info: 'linear-gradient(90deg, #2196F3 0%, #1976D2 100%)',
    light: 'linear-gradient(90deg, #ECEFF1 0%, #CFD8DC 100%)',
  };

  // Define shadow colors for each variant
  const shadowColors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    info: '#2196F3',
    light: '#B0BEC5',
  };

  // Define text colors for each variant
  const textColors = {
    primary: '#ffffff',
    secondary: '#ffffff',
    success: '#ffffff',
    warning: '#ffffff',
    danger: '#ffffff',
    info: '#ffffff',
    light: '#37474F',
  };

  // Define padding based on size
  const padding = {
    small: { py: 0.75, px: 2 },
    medium: { py: 1.25, px: 3 },
    large: { py: 1.75, px: 4 },
  };

  // Define font size based on size
  const fontSize = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
  };

  return (
    <Button
      {...props}
      variant="contained"
      disabled={isLoading || props.disabled}
      fullWidth={fullWidth}
      sx={{
        background: gradients[variant],
        color: textColors[variant],
        borderRadius: 2,
        boxShadow: `0 8px 20px ${alpha(shadowColors[variant], 0.3)}`,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: fontSize[size],
        ...padding[size],
        transition: 'all 0.3s ease',
        '&:hover': {
          background: gradients[variant],
          boxShadow: `0 10px 25px ${alpha(shadowColors[variant], 0.4)}`,
          transform: 'translateY(-2px)',
        },
        '&:disabled': {
          background: alpha(shadowColors[variant], 0.5),
          color: alpha(textColors[variant], 0.7),
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};

export default AppButton;
