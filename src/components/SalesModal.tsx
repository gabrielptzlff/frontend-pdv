import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product, Sale } from "../types/Sale";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

interface SaleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Omit<Sale, "id">, id?: number) => void;
  initialData?: Sale | null;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [customer, setCustomer] = useState("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (initialData) {
      setCustomer(initialData.customer);
      setTotalPrice(initialData.totalPrice);
      setPaymentMethod(initialData.paymentMethod);
      setProducts(initialData.products);
    } else {
      setCustomer("");
      setTotalPrice(0);
      setPaymentMethod("");
      setProducts([]);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({ customer, totalPrice, paymentMethod, products }, initialData?.id);
    onClose();
  };

  const handleAdd = () => {
    setEditingSale(null);
    setModalOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Deseja remover este produto?")) {
      await axios.delete(`${API_URL}/sales/${id}`);
      // fetchSales();
    }
  };

  const productColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Produto", width: 180 },
    { field: "quantity", headerName: "Quantidade", width: 120 },
    { field: "price", headerName: "Preço", width: 120 },
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {initialData ? "Alterar Venda" : "Incluir Venda"}
      </DialogTitle>
      <DialogContent>
        {/* ...outros campos do modal... */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Produtos
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Incluir
          </Button>
        </Typography>
        <div style={{ height: 200, width: "100%" }}>
          <DataGrid
            rows={products}
            columns={productColumns}
            pageSizeOptions={[5]}
            pagination
            disableRowSelectionOnClick
            autoHeight
          />
        </div>
      </DialogContent>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Cliente"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            fullWidth
          />
          <TextField
            label="Total"
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Método de Pagamento"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
