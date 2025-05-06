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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getInventoryItems, getCategories } from '../../services/inventoryService';
import type { InventoryItem } from '../../types/index';

const InventoryList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch inventory items with pagination, search, and filters
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    refetch: refetchInventory,
  } = useQuery({
    queryKey: ['inventoryItems', page, rowsPerPage, searchTerm, selectedCategory, selectedStatus],
    queryFn: () =>
      getInventoryItems(
        page + 1,
        rowsPerPage,
        searchTerm,
        selectedCategory,
        selectedStatus
      ),
  });

  // Fetch categories for filter dropdown
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
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

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value);
    setPage(0);
  };

  const handleAddItem = () => {
    navigate('/inventory/add');
  };

  const handleEditItem = (id: string) => {
    navigate(`/inventory/edit/${id}`);
  };

  const handleDeleteItem = (id: string) => {
    // In a real application, you would show a confirmation dialog
    // and then call the delete API
    console.log('Delete item:', id);
  };

  const handleViewItem = (id: string) => {
    navigate(`/inventory/view/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'success';
      case 'low-stock':
        return 'warning';
      case 'out-of-stock':
        return 'error';
      default:
        return 'default';
    }
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          Add New Item
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search items by name, SKU, or description"
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
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  variant="outlined"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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
                  <MenuItem value="in-stock">In Stock</MenuItem>
                  <MenuItem value="low-stock">Low Stock</MenuItem>
                  <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                </TextField>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingInventory ? (
              // Loading skeleton
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={30} /></TableCell>
                  <TableCell align="center"><Skeleton variant="rectangular" width={120} height={30} /></TableCell>
                </TableRow>
              ))
            ) : (
              // Actual data
              (inventoryData?.data || []).map((item: InventoryItem) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' } }}
                  onClick={() => handleViewItem(item.id)}
                >
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                      color={getStatusColor(item.status) as 'success' | 'warning' | 'error' | 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditItem(item.id);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!isLoadingInventory && (!inventoryData?.data || inventoryData.data.length === 0) && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={inventoryData?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default InventoryList;
