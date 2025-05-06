import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { getCategories } from '../../services/inventoryService';
import { getSuppliers } from '../../services/procurementService';
import {
  generateInventoryReport,
  generateProcurementReport,
  generateShipmentReport,
  createReport,
  exportReport,
} from '../../services/reportService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('inventory');
  const [reportName, setReportName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Fetch categories for inventory report filters
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    enabled: reportType === 'inventory',
  });

  // Fetch suppliers for procurement report filters
  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => getSuppliers(1, 100),
    enabled: reportType === 'procurement',
  });

  const handleReportTypeChange = (event: SelectChangeEvent) => {
    setReportType(event.target.value);
    setReportData(null);
    setError(null);
    setSelectedCategories([]);
    setSelectedSuppliers([]);
    setSelectedStatuses([]);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedCategories(event.target.value as string[]);
  };

  const handleSupplierChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedSuppliers(event.target.value as string[]);
  };

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedStatuses(event.target.value as string[]);
  };

  const getStatusOptions = () => {
    switch (reportType) {
      case 'inventory':
        return [
          { value: 'in-stock', label: 'In Stock' },
          { value: 'low-stock', label: 'Low Stock' },
          { value: 'out-of-stock', label: 'Out of Stock' },
        ];
      case 'procurement':
        return [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' },
        ];
      case 'shipment':
        return [
          { value: 'pending', label: 'Pending' },
          { value: 'in-transit', label: 'In Transit' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' },
        ];
      default:
        return [];
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setReportData(null);

    try {
      const dateRange = startDate && endDate
        ? { start: startDate.toISOString(), end: endDate.toISOString() }
        : undefined;

      let data;
      switch (reportType) {
        case 'inventory':
          data = await generateInventoryReport({
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
            dateRange,
          });
          break;
        case 'procurement':
          data = await generateProcurementReport({
            suppliers: selectedSuppliers.length > 0 ? selectedSuppliers : undefined,
            status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
            dateRange,
          });
          break;
        case 'shipment':
          data = await generateShipmentReport({
            status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
            dateRange,
          });
          break;
        default:
          throw new Error('Invalid report type');
      }

      setReportData(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      setError('Please enter a report name');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const parameters = {
        reportType,
        dateRange: startDate && endDate
          ? { start: startDate.toISOString(), end: endDate.toISOString() }
          : undefined,
        categories: selectedCategories,
        suppliers: selectedSuppliers,
        statuses: selectedStatuses,
      };

      await createReport({
        name: reportName,
        type: reportType as any,
        createdBy: 'current-user', // This would be replaced with the actual user ID
        parameters,
      });

      // Reset form after saving
      setReportName('');
    } catch (err) {
      setError((err as Error).message || 'Failed to save report');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportReport = async () => {
    if (!reportData) {
      setError('Please generate a report first');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // In a real application, this would call the export API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate a download by showing an alert
      alert(`Report exported as ${exportFormat.toUpperCase()}`);
    } catch (err) {
      setError((err as Error).message || 'Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const renderReportFilters = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="report-type-label">Report Type</InputLabel>
            <Select
              labelId="report-type-label"
              id="report-type"
              value={reportType}
              label="Report Type"
              onChange={handleReportTypeChange}
            >
              <MenuItem value="inventory">Inventory Report</MenuItem>
              <MenuItem value="procurement">Procurement Report</MenuItem>
              <MenuItem value="shipment">Shipment Report</MenuItem>
              <MenuItem value="custom">Custom Report</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

        {reportType === 'inventory' && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="categories-label">Categories</InputLabel>
              <Select
                labelId="categories-label"
                id="categories"
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const category = categories?.find(c => c.id === value);
                      return (
                        <Chip key={value} label={category?.name || value} />
                      );
                    })}
                  </Box>
                )}
              >
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {reportType === 'procurement' && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="suppliers-label">Suppliers</InputLabel>
              <Select
                labelId="suppliers-label"
                id="suppliers"
                multiple
                value={selectedSuppliers}
                onChange={handleSupplierChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const supplier = suppliers?.data.find(s => s.id === value);
                      return (
                        <Chip key={value} label={supplier?.name || value} />
                      );
                    })}
                  </Box>
                )}
              >
                {suppliers?.data.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              multiple
              value={selectedStatuses}
              onChange={handleStatusChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={getStatusOptions().find(s => s.value === value)?.label || value} />
                  ))}
                </Box>
              )}
            >
              {getStatusOptions().map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerateReport}
            disabled={isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} /> : null}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderReportVisualization = () => {
    if (!reportData) return null;

    const renderChart = () => {
      switch (reportType) {
        case 'inventory':
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Inventory by Category" />
                  <Divider />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.categoryDistribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Inventory Status" />
                  <Divider />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={reportData.statusCounts}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          );
        case 'procurement':
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Orders by Supplier" />
                  <Divider />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.supplierDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.supplierDistribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Monthly Order Trends" />
                  <Divider />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={reportData.monthlyTrends}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" name="Orders" />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Value ($)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          );
        case 'shipment':
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Shipment Status" />
                  <Divider />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.statusDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.statusDistribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Shipments by Destination" />
                  <Divider />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={reportData.destinationCounts}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          );
        default:
          return null;
      }
    };

    return (
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Report Results</Typography>
            <Box>
              <TextField
                label="Report Name"
                size="small"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSaveReport}
                disabled={isSaving || !reportName.trim()}
                sx={{ mr: 1 }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={exportFormat === 'pdf' ? <PdfIcon /> : <ExcelIcon />}
                onClick={handleExportReport}
                disabled={isExporting}
                endIcon={<DownloadIcon />}
              >
                {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item>
              <Chip
                label={`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`}
                color="primary"
              />
            </Grid>
            {startDate && endDate && (
              <Grid item>
                <Chip
                  label={`Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                  color="primary"
                />
              </Grid>
            )}
            {selectedCategories.length > 0 && (
              <Grid item>
                <Chip
                  label={`Categories: ${selectedCategories.length}`}
                  color="primary"
                />
              </Grid>
            )}
            {selectedSuppliers.length > 0 && (
              <Grid item>
                <Chip
                  label={`Suppliers: ${selectedSuppliers.length}`}
                  color="primary"
                />
              </Grid>
            )}
            {selectedStatuses.length > 0 && (
              <Grid item>
                <Chip
                  label={`Statuses: ${selectedStatuses.length}`}
                  color="primary"
                />
              </Grid>
            )}
          </Grid>

          {renderChart()}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1">
              {reportData.summary}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Report Generator
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report Parameters
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {renderReportFilters()}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {reportData ? (
            renderReportVisualization()
          ) : (
            <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  No Report Generated Yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Set your parameters and click "Generate Report" to see results here.
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportGenerator;
