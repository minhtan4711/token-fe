import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { BSCSCAN_TX_URL, BSCSCAN_ADDRESS_URL } from "../../../constants";

const TopTable = ({ headers, rows, name }) => {
  const columnNames = {
    transaction_hash: 'Transaction Hash',
    value: 'Value',
    wallet: 'Wallet',
    amount: 'Amount',
    number_of_transfers: 'Number of Transfers',
    from: "From",
    to: "To",
  }

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const renderTableCell = (header, value) => {
    let content = value;
    if (header === 'transaction_hash') {
      content = <a href={`${BSCSCAN_TX_URL}/${value}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }} target="_blank" rel="noopener noreferrer">{value}</a>;
    } else if (header === 'wallet') {
      content = <a href={`${BSCSCAN_ADDRESS_URL}/${value}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }} target="_blank" rel="noopener noreferrer">{value}</a>;
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
      <Table sx={{ minWidth: '650px' }} aria-label="simple table">
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
            <TableRow key={row.transaction_hash}>
              <TableCell>#{index + 1}</TableCell>
              {headers.map((header) => renderTableCell(header, row[header]))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </TableContainer>
  );
}

export default TopTable;