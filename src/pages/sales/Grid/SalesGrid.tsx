import "./SalesGrid.css";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Sale } from "../../../types/Sale";
import { getAllSales } from "../SalesService";

export const SalesGrid: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getAllSales();
        setSales(data);
      } catch (err) {
        setError("Failed to fetch sales data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <TableContainer>
      <div className="grid-container">
        <Table className="grid-custom">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Método de Pagamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => {
              return (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.customer?.[0]?.name || ""}</TableCell>
                  <TableCell>{sale.totalPrice}</TableCell>
                  <TableCell>{sale.paymentMethod?.[0]?.name || ""}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  );
};
