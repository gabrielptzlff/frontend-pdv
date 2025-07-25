import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Stack, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Sale } from "./types/Sale";
import { SaleModal } from "./components/SalesModal";

const API_URL = process.env.REACT_APP_API_URL;

const App: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    const res = await axios.get<Sale[]>(`${API_URL}/sales`);
    const handleData = res.data.map((sale: Sale) => ({
      ...sale,
      customer:
        Array.isArray(sale.customer) && sale.customer !== null
          ? sale.customer[0].name
          : sale.customer,
      paymentMethod:
        Array.isArray(sale.paymentMethod) && sale.paymentMethod !== null
          ? sale.paymentMethod[0].name
          : sale.paymentMethod,
    }));

    setSales(handleData);
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
      await axios.delete(`${API_URL}/sales/${id}`);
      fetchSales();
    }
  };

  const handleSave = async (sale: Omit<Sale, "id">, id?: number) => {
    if (id) {
      await axios.put(`${API_URL}/sales/${id}`, sale);
    } else {
      await axios.post(`${API_URL}/sales`, sale);
    }
    fetchSales();
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90, sortable: true },
    { field: "customer", headerName: "Cliente", width: 200, sortable: true },
    { field: "totalPrice", headerName: "Total", width: 120, sortable: true },
    {
      field: "paymentMethod",
      headerName: "Método de Pagamento",
      width: 180,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 180,
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
          rows={sales}
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
    </Container>
  );
};

export default App;
