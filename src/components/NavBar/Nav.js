import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RestartAltSharpIcon from '@mui/icons-material/RestartAltSharp';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { clearToken } from "../../features/token/tokenSlice";
import { clearDapp } from "../../features/dapp/dappSlice";
import { clearTimestamp } from "../../features/timestamp/timestampSlice";
import { useNavigate } from "react-router-dom";


function Nav() {
  const { address } = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleResetClick = () => {
    navigate('/');
    dispatch(clearToken());
    dispatch(clearDapp());
    dispatch(clearTimestamp());
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ width: 170 }}>
            {address && (
              <Link to={`/${address}/details`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                Token Details
              </Link>
            )}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {address && (
              <Link to={`/${address}/transfer-timeline`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                Token Transfer Timeline
              </Link>
            )}
          </Typography>
          <IconButton
            size="large"
            aria-label="reset app"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleResetClick}
          >
            <Link to="/">
              <RestartAltSharpIcon sx={{ color: "white" }} />
            </Link>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Nav;