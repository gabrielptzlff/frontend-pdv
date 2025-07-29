import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Product } from "../../../types/Product";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  products: Product[];
  initialData?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onSave,
  products,
  initialData,
}) => {
  const [selectedId, setSelectedId] = useState<number | "">(
    initialData?.productId ?? ""
  );
  const [quantity, setQuantity] = useState<number>(initialData?.quantity ?? 1);
  useEffect(() => {
    setSelectedId(initialData?.productId ?? "");
    setQuantity(initialData?.quantity ?? 1);
  }, [initialData, open]);

  const handleSave = () => {
    const prod = products.find((p) => p.id === selectedId) || initialData;
    if (prod) {
      onSave({ ...prod, quantity });
      onClose();
      setSelectedId(prod.id ? prod.id : "");
      setQuantity(quantity > 0 ? quantity : 1);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Produto</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            fullWidth
            disabled={!!initialData}
          >
            <MenuItem value="">
              <em>Selecione um produto</em>
            </MenuItem>
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Quantidade"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!selectedId}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
