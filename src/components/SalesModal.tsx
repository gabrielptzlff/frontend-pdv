import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { Sale } from "../types/Sale";

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

  useEffect(() => {
    if (initialData) {
      setCustomer(initialData.customer);
      setTotalPrice(initialData.totalPrice);
      setPaymentMethod(initialData.paymentMethod);
    } else {
      setCustomer("");
      setTotalPrice(0);
      setPaymentMethod("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({ customer, totalPrice, paymentMethod }, initialData?.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {initialData ? "Alterar Venda" : "Incluir Venda"}
      </DialogTitle>
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
