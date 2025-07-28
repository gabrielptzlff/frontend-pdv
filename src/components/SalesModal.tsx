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
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { insertSale, Sale } from "../types/Sale";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import { Product } from "../types/Product";
import { ProductModal } from "./ProductsModal";

const API_URL = process.env.REACT_APP_API_URL;

interface SaleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Omit<insertSale, "id">, id?: number) => void;
  initialData?: Sale | null;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [customer, setCustomer] = useState<{ id: number; name: string }[]>([]);
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>(
    []
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    { id: number; name: string }[]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<
    { id: number; name: string }[]
  >([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsInSale, setProductsInSale] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Customers
  useEffect(() => {
    axios.get(`${API_URL}/customers`).then((res) => {
      setCustomers(res.data);
    });
  }, []);

  // Payment Methods
  useEffect(() => {
    axios.get(`${API_URL}/payment-methods`).then((res) => {
      setPaymentMethods(res.data);
    });
  }, []);

  // Products
  useEffect(() => {
    axios.get(`${API_URL}/products`).then((res) => {
      setAllProducts(res.data);
    });
  }, []);

  useEffect(() => {
    if (initialData) {
      setCustomer(initialData.customer);
      setTotalPrice(Number(initialData.totalPrice || 0));
      setPaymentMethod(initialData.paymentMethod);
      setProductsInSale(
        initialData.products.map((p) => {
          const fullProduct = allProducts.find((prod) => prod.id === p.id);
          return {
            id: p.id,
            name: fullProduct?.name || "",
            unit_price: fullProduct?.unit_price ?? p.unit_price ?? 0,
            quantity: p.quantity,
          };
        })
      );
    } else {
      setCustomer([]);
      setTotalPrice(0);
      setPaymentMethod([]);
      setProductsInSale([]);
    }
  }, [initialData]);

  useEffect(() => {
    if (!open) {
      setCustomer([]);
      setTotalPrice(0);
      setPaymentMethod([]);
      setProductsInSale([]);
    }
  }, [open]);

  useEffect(() => {
    const total = productsInSale.reduce(
      (acc, p) => acc + (Number(p.unit_price) || 0) * (Number(p.quantity) || 0),
      0
    );
    setTotalPrice(total);
  }, [productsInSale]);

  const handleSubmit = () => {
    const totalPrice = productsInSale.reduce(
      (acc, p) =>
        acc + (Number(p.unit_price ?? 0) || 0) * (Number(p.quantity ?? 0) || 0),
      0
    );

    onSave(
      {
        customerId: customer[0].id,
        paymentMethodId: paymentMethod[0].id,
        totalPrice, // envia o total calculado
        products: productsInSale.map((p) => ({
          product_id: p.id ?? 0,
          quantity: p.quantity,
          unit_price: p.unit_price ?? 0,
        })),
      },
      initialData?.id
    );
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

  const handleDelete = (id: number) => {
    setProductsInSale((prev) => prev.filter((p) => p.id !== id));
  };

  const productColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Produto", width: 300 },
    { field: "quantity", headerName: "Quantidade", width: 120 },
    { field: "price", headerName: "Preço", width: 120 }, // <-- aqui!
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
            onClick={() => {
              setEditingProduct(params.row);
              setProductModalOpen(true);
            }}
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {initialData ? "Alterar Venda" : "Incluir Venda"}
      </DialogTitle>
      <DialogContent>
        {/* ...outros campos do modal... */}
        <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
          Produtos
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => setProductModalOpen(true)}
            sx={{ float: "right" }}
          >
            Incluir
          </Button>
        </Typography>
        <ProductModal
          open={productModalOpen}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={(product) => {
            if (editingProduct) {
              setProductsInSale((prev) =>
                prev.map((p) => (p.id === product.id ? product : p))
              );
            } else {
              setProductsInSale((prev) => [...prev, product]);
            }
            setEditingProduct(null);
          }}
          products={
            editingProduct
              ? allProducts.filter(
                  (p) =>
                    !productsInSale.some(
                      (added) =>
                        added.id === p.id && added.id !== editingProduct.id
                    )
                )
              : allProducts.filter(
                  (p) => !productsInSale.some((added) => added.id === p.id)
                )
          }
          initialData={editingProduct || null}
        />
        <div style={{ height: 200, width: "100%" }}>
          <DataGrid
            rows={productsInSale}
            columns={productColumns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5]}
            pagination
            disableRowSelectionOnClick
            autoHeight
          />
        </div>
      </DialogContent>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Select
            required={true}
            label="Cliente"
            value={customer}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedCustomer = customers.find(
                (c) => c.id === selectedId
              );
              setCustomer(selectedCustomer ? [selectedCustomer] : []);
            }}
            displayEmpty
            fullWidth
            renderValue={(selected) => {
              if (
                !selected ||
                (Array.isArray(selected) && selected.length === 0)
              )
                return "Selecione um cliente";
              const selectedId = Array.isArray(selected)
                ? selected[0]?.id ?? selected[0]
                : selected;
              const found = customers.find((c) => c.id === Number(selectedId));
              return found ? found.name : "Selecione um cliente";
            }}
          >
            <MenuItem value="">
              <em>Selecione um cliente</em>
            </MenuItem>
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <NumericFormat
            customInput={TextField}
            label="Total"
            value={totalPrice}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Select
            required={true}
            label="Forma de Pagamento"
            value={paymentMethod}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedPaymentMethod = paymentMethods.find(
                (p) => p.id === selectedId
              );
              setPaymentMethod(
                selectedPaymentMethod ? [selectedPaymentMethod] : []
              );
            }}
            displayEmpty
            fullWidth
            renderValue={(selected) => {
              if (
                !selected ||
                (Array.isArray(selected) && selected.length === 0)
              ) {
                return "Selecione uma forma de pagamento";
              }
              if (Array.isArray(selected)) {
                const selectedId = selected[0]?.id ?? selected[0];
                const found = paymentMethods.find(
                  (p) => p.id === Number(selectedId)
                );
                return found ? found.name : "Selecione uma forma de pagamento";
              }
              const found = paymentMethods.find(
                (p) => p.id === Number(selected)
              );
              return found ? found.name : "Selecione uma forma de pagamento";
            }}
          >
            <MenuItem value="">
              <em>Selecione uma forma de pagamento</em>
            </MenuItem>
            {paymentMethods.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => {
            onSave(
              {
                customerId: customer[0].id,
                paymentMethodId: paymentMethod[0].id,
                totalPrice,
                products: productsInSale.map((p) => ({
                  id: p.id ?? 0,
                  quantity: p.quantity,
                })),
              },
              initialData?.id
            );
            onClose();
          }}
          variant="contained"
          color="primary"
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
