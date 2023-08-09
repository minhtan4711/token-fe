import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { BSCSCAN_TX_URL, BSCSCAN_ADDRESS_URL } from "../../../constants";
import { useDispatch } from "react-redux";
import { selectDapp } from "../../../features/dapp/dappSlice";

const TopTable = ({ headers, rows, name, width }) => {
  const dispatch = useDispatch();

  const handleRowClickDappId = (id) => {
    dispatch(selectDapp({ id }));
  }

  const columnNames = {
    transaction_hash: 'Transaction Hash',
    value: 'Value',
    wallet: 'Wallet',
    amount: 'Amount',
    number_of_transfers: 'Number of Transfers',
    from: "From",
    to: "To",
    name: "Name",
    image: "Image",
    id: "ID",
  }

  const renderTableCell = (header, value) => {
    let content = value;
    if (header === 'transaction_hash') {
      content = <a href={`${BSCSCAN_TX_URL}/${value}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }} target="_blank" rel="noopener noreferrer">{value}</a>;
    } else if (header === 'wallet') {
      content = <a href={`${BSCSCAN_ADDRESS_URL}/${value}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }} target="_blank" rel="noopener noreferrer">{value}</a>;
    } else if (header === 'image') {
      content = <img src={value} alt="Dapp Icon" style={{ width: '40px', height: '40px' }} />;
    }

    return (
      <TableCell key={header}>
        {content}
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper}>
      <h2 style={{ textAlign: 'center' }}>{name}</h2>
      <Table sx={{ width: width }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            {headers.map((header, index) => (
              <TableCell key={index}>{columnNames[header]}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow style={{
              cursor: 'pointer',
              transition: 'transform 0.3s, boxShadow 0.3s',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }} key={row.transaction_hash} onClick={() => handleRowClickDappId(row.id)}>
              <TableCell>#{index + 1}</TableCell>
              {headers.map((header) => renderTableCell(header, row[header]))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TopTable;