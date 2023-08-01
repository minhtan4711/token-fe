import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { tokens, API_URL, ClusteredBy } from "../../constants";
import { selectToken } from "../../features/token/tokenSlice";
import { selectDapp } from "../../features/dapp/dappSlice";

export default function Home() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [token, setToken] = useState("");
	const [dapp, setDapp] = useState("");
	const [clustered, setClustered] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const [dapps, setDapps] = useState([]);

	const handleTokenChange = (event) => {
		setToken(event.target.value);
		const selectedToken = tokens.find(
			(token) => token.address === event.target.value
		);
		if (selectToken) {
			dispatch(
				selectToken({
					name: selectedToken.name,
					id: selectedToken.id,
					address: selectedToken.address,
					image: selectedToken.image,
				})
			);
		}
	};

	useEffect(() => {
		if (token) {
			fetch(`${API_URL}/dapps/${token}`)
				.then((response) => response.json())
				.then((data) => setDapps(data))
				.catch((error) => console.log(error));
		}
	}, [token]);

	const handleDappChange = (event) => {
		setDapp(event.target.value);
		const selectedDapp = dapps.find((dapp) => dapp.id === event.target.value);
		if (selectedDapp) {
			dispatch(
				selectDapp({
					id: selectedDapp.id,
					name: selectedDapp.name,
					address: selectedDapp.address,
					image: selectedDapp.image,
				})
			);
		}
	};

	const handleClusteredChange = (event) => {
		setClustered(event.target.value);
	};

	const handleClick = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			navigate(`${token}/transfer-timeline`);
		}, 1000);
	};

	return (
		<div>
			<Loading open={isLoading} />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
					maxWidth: 500,
					maxHeight: 500,
					margin: "auto",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<h2 style={{ textAlign: "center", lineHeight: "2rem" }}>
					Start by choosing your desired token from the dropdown list.
				</h2>
				<FormControl sx={{ minWidth: 500 }}>
					<InputLabel id="demo-simple-select-label">Token</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						label="Token"
						value={token}
						onChange={handleTokenChange}
					>
						{tokens.map((token, index) => (
							<MenuItem key={index} value={token.address}>
								<img
									src={token.image}
									alt={token.name}
									style={{ width: "20px", marginRight: "10px" }}
								/>
								{token.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{dapps.length > 0 && (
					<FormControl sx={{ minWidth: 500 }}>
						<InputLabel id="dapp-select-label">Dapp</InputLabel>
						<Select
							labelId="dapp-select-label"
							id="dapp-select"
							label="Dapp"
							value={dapp}
							onChange={handleDappChange}
						>
							{dapps.map((dappItem, index) => (
								<MenuItem key={index} value={dappItem.id}>
									<img
										src={dappItem.image}
										alt={dappItem.name}
										style={{ width: "20px", marginRight: "10px" }}
									/>
									{dappItem.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
				{token && dapp && (
					<FormControl sx={{ minWidth: 500 }}>
						<InputLabel id="clustered-select-label">Clustered By</InputLabel>
						<Select
							labelId="clustered-select-label"
							id="clustered-select"
							label="Clustered By"
							value={clustered}
							onChange={handleClusteredChange}
						>
							{ClusteredBy.map((clustered, index) => (
								<MenuItem key={index} value={clustered}>
									{clustered}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}

				{token && dapp && clustered && (
					<Stack direction="row" spacing={2}>
						<Button
							variant="contained"
							endIcon={<TrendingFlatIcon />}
							onClick={handleClick}
						>
							Process
						</Button>
					</Stack>
				)}
			</Box>
		</div>
	);
}
