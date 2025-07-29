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
import { insertSale, Sale } from "../../../types/Sale";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import { Product } from "../../../types/Product";
import { ProductModal } from "./SalesProductsModal";
import {
  getAllCustomers,
  getAllPaymentMethods,
  getAllProducts,
} from "../SalesService";

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

  useEffect(() => {
    async function fetchData() {
      const customersData = await getAllCustomers();
      setCustomers(customersData);

      const paymentMethodsData = await getAllPaymentMethods();
      setPaymentMethods(paymentMethodsData);

      const productsData = await getAllProducts();
      setAllProducts(productsData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setCustomer(initialData.customer);
      setTotalPrice(Number(initialData.totalPrice || 0));
      setPaymentMethod(initialData.paymentMethod);
      setProductsInSale(
        initialData.products.map((p) => {
          const fullProduct = allProducts.find(
            (prod) => prod.productId === p.productId
          );
          return {
            id: fullProduct?.productId ?? 0,
            name: fullProduct?.name || "",
            unit_price: fullProduct?.unit_price ?? p.unit_price ?? 0,
            quantity: p.quantity,
            total_price:
              (fullProduct?.unit_price ?? p.unit_price ?? 0) * p.quantity,
          };
        })
      );
    }
  }, [initialData, productsInSale]);

  useEffect(() => {
    const total = productsInSale.reduce((acc, p) => {
      return acc + (Number(p.unit_price) || 0) * (Number(p.quantity) || 0);
    }, 0);
    setTotalPrice(total);
  }, [productsInSale]);

  const handleSubmit = async () => {
    onSave(
      {
        customerId: customer[0].id,
        paymentMethodId: paymentMethod[0].id,
        totalPrice,
        products: productsInSale.map((p) => ({
          product_id: p.productId ?? 0,
          quantity: p.quantity,
          unit_price: p.unit_price ?? 0,
        })),
      },
      initialData?.id
    );
    onClose();
  };

  const handleDelete = (id: number) => {
    setProductsInSale((prev) => prev.filter((p) => p.productId !== id));
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
            const prod = {
              ...product,
              id: product.productId ?? product.id,
              productId: product.productId ?? product.id,
            };
            if (editingProduct) {
              setProductsInSale((prev) =>
                prev.map((p) => (p.productId === prod.productId ? prod : p))
              );
            } else {
              setProductsInSale((prev) => [...prev, prod]);
            }
            setEditingProduct(null);
            setProductModalOpen(false);
          }}
          products={
            editingProduct
              ? allProducts.filter(
                  (p) =>
                    !productsInSale.some(
                      (added) =>
                        added.productId === p.productId &&
                        added.productId !== editingProduct.productId
                    )
                )
              : allProducts.filter(
                  (p) =>
                    !productsInSale.some(
                      (added) => added.productId === p.productId
                    )
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
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
