import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Stack, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { insertSale, Sale } from "./types/Sale";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { SaleModal } from "./pages/sales/Modal/SalesModal";

const API_URL = process.env.REACT_APP_API_URL;

const App: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = createTheme({ palette: { mode } });

  const fetchSales = async () => {
    setLoading(true);
    const res = await axios.get<Sale[]>(`${API_URL}/sales`);
    setSales(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleAdd = () => {
    setEditingSale(null);
    setModalOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Deseja excluir esta venda?")) {
      await axios.delete(`${API_URL}/sales`, { params: { id: id } });
      fetchSales();
    }
  };

  const handleSave = async (sale: Omit<insertSale, "id">, id?: number) => {
    if (id) {
      await axios.patch(`${API_URL}/sales?id=${id}`, sale, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await axios.post(`${API_URL}/sales`, sale);
    }
    fetchSales();
  };

  const salesWithNames = sales.map((sale) => ({
    ...sale,
    customerName: sale.customer?.[0]?.name || "",
    paymentMethodName: sale.paymentMethod?.[0]?.name || "",
  }));

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90, sortable: true },
    {
      field: "customerName",
      headerName: "Cliente",
      width: 200,
      sortable: true,
    },
    { field: "totalPrice", headerName: "Total", width: 120, sortable: true },
    {
      field: "paymentMethodName",
      headerName: "Método de Pagamento",
      width: 180,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 240,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row as Sale)}
          >
            Alterar
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Excluir
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Gestão de Vendas</Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Incluir
          </Button>
        </Stack>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={salesWithNames}
            columns={columns}
            pagination
            paginationModel={{ pageSize: 10, page: 0 }}
            pageSizeOptions={[10]}
            loading={loading}
            disableRowSelectionOnClick
          />
        </div>
        <SaleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editingSale}
        />
        <IconButton
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Container>
    </ThemeProvider>
  );
};

export default App;
