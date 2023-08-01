import React from 'react'
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function Loading({ open }) {
    return (
        <div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress color="inherit" />
                    <Typography sx={{ marginTop: '1rem' }}>Please wait while we retrieving data</Typography>
                </Box>
            </Backdrop>
        </div>
    )

}
