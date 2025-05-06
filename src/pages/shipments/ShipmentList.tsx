import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Grid,
  MenuItem,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getShipments } from '../../services/shipmentService';
import type { Shipment } from '../../types/index';

const ShipmentList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch shipments with pagination, search, and filters
  const {
    data: shipmentData,
    isLoading: isLoadingShipments,
    refetch: refetchShipments,
  } = useQuery({
    queryKey: ['shipments', page, rowsPerPage, searchTerm, selectedStatus],
    queryFn: () =>
      getShipments(
        page + 1,
        rowsPerPage,
        searchTerm,
        selectedStatus
      ),
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value);
    setPage(0);
  };

  const handleAddShipment = () => {
    navigate('/shipments/create');
  };

  const handleEditShipment = (id: string) => {
    navigate(`/shipments/edit/${id}`);
  };

  const handleViewShipment = (id: string) => {
    navigate(`/shipments/view/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-transit':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shipment Tracking
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddShipment}
        >
          Create Shipment
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by reference number or destination"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={toggleFilter}
              sx={{ mr: 1 }}
            >
              Filters
            </Button>
          </Grid>

          {filterOpen && (
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={selectedStatus}
                onChange={handleStatusChange}
                variant="outlined"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-transit">In Transit</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          )}
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="shipments table">
          <TableHead>
            <TableRow>
              <TableCell>Reference Number</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Shipment Date</TableCell>
              <TableCell>Expected Arrival</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingShipments ? (
              // Loading skeleton
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={30} /></TableCell>
                  <TableCell align="center"><Skeleton variant="rectangular" width={120} height={30} /></TableCell>
                </TableRow>
              ))
            ) : (
              // Actual data
              (shipmentData?.data || []).map((shipment: Shipment) => (
                <TableRow
                  key={shipment.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' } }}
                  onClick={() => handleViewShipment(shipment.id)}
                >
                  <TableCell component="th" scope="row">
                    {shipment.referenceNumber}
                  </TableCell>
                  <TableCell>{shipment.origin}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>{new Date(shipment.shipmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(shipment.expectedArrivalDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(shipment.status)}
                      color={getStatusColor(shipment.status) as 'warning' | 'info' | 'success' | 'error' | 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewShipment(shipment.id);
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditShipment(shipment.id);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!isLoadingShipments && (!shipmentData?.data || shipmentData.data.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No shipments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={shipmentData?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default ShipmentList;
