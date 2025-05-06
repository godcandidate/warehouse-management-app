# Warehouse Management System

![Warehouse Management System](https://img.shields.io/badge/Warehouse-Management-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-5.0+-0081CB?logo=material-ui&logoColor=white)

A modern, responsive Warehouse Management System built with React, TypeScript, and Material UI. This application provides comprehensive tools for inventory management, procurement, shipment tracking, and reporting.

## Features

### Authentication Module
- Secure login/logout functionality
- JWT token-based authentication
- Protected routes with role-based access control

### Dashboard
- Overview statistics with key metrics
- Recent activities tracking
- Quick action buttons for common tasks
- Status cards for inventory, procurement, and shipments

### Inventory Management
- Complete item listing with advanced filters and search
- Category management
- Stock level monitoring with threshold alerts
- Inventory status tracking (in-stock, low-stock, out-of-stock)

### Procurement System
- Supplier management
- Purchase order creation and tracking
- Procurement request workflow
- Item purchasing forms

### Shipment Tracking
- Transfer management between locations
- Returns processing
- Shipment status monitoring
- Item transfer forms

### Report Management
- Comprehensive report generation
- Data visualization with interactive charts
- Export functionality (PDF, CSV, Excel)
- Custom report builder

## Technical Stack

- **Frontend**: React 18+ with TypeScript
- **UI Framework**: Material-UI v5
- **State Management**: React Query for server state, Context API for global state
- **Routing**: React Router v6
- **API Integration**: Axios with interceptors for token management
- **Authentication**: JWT/Token-based auth
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form
- **Notifications**: Notistack

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/warehouse-management-app.git
   cd warehouse-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://your-api-url/api
```

## Project Structure

```
/src
  /assets            # Static assets (images, fonts, etc.)
  /components        # Reusable UI components
  /context           # React Context providers
  /hooks             # Custom React hooks
  /layouts           # Page layout components
  /pages             # Application pages
    /auth            # Authentication pages
    /dashboard       # Dashboard pages
    /inventory       # Inventory management pages
    /procurement     # Procurement system pages
    /shipments       # Shipment tracking pages
    /reports         # Report management pages
    /profile         # User profile pages
  /services          # API service functions
  /types             # TypeScript type definitions
  /utils             # Utility functions
```

## Build for Production

```bash
npm run build
```

This will create a `dist` folder with the compiled assets ready for deployment.

## License

MIT

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/)
- [Vite](https://vitejs.dev/)
