import React, { useState, useEffect } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TopTable from "../Table/Top/TopTable";
import { useSelector } from "react-redux";
import { API_URL } from "../../constants";

function TransferModal({ open, data, handleClose, headers }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    width: 1200,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const formatData = (data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map(item => {
      const newItem = { ...item };

      if (item.from && item.from.includes('wallets/')) {
        newItem.from = item.from.replace('wallets/', '');
      }
      if (item.to && item.to.includes('wallets/')) {
        newItem.to = item.to.replace('wallets/', '');
      }

      return newItem;
    });
  }

  const { start_timestamp, end_timestamp } = useSelector(state => state.timestamp);
  const { address } = useSelector(state => state.token)
  const [transferData, setTransferData] = useState(null);

  useEffect(() => {
    if (data) {
      const fetchTransferData = async () => {
        const addressList = data.addresses.join(',');
        const response = await fetch(`${API_URL}/group-transfer/${address}?start_timestamp=${start_timestamp}&end_timestamp=${end_timestamp}&address_list=${addressList}`);
        let responseData = await response.json();
        responseData = formatData(responseData);

        setTransferData(responseData);
      }
      fetchTransferData();
    }

  }, [address, data, end_timestamp, start_timestamp]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          {data &&
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body1">Group: {data.group}</Typography>
              <Typography variant="body1">ID: {data.id}</Typography>
              <Typography variant="body1">Number of Addresses: {data.addresses.length}</Typography>
            </Box>
          }
        </div>
        <div>
          {
            transferData &&
            <TopTable rows={transferData} headers={headers} name="Transfer Information" />
          }
        </div>


      </Box>
    </Modal>
  )
}

export default TransferModal;
