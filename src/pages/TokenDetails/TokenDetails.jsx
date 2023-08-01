import React, { useEffect, useState } from "react";
import "./TokenDetails.css";
import Layout from "../../components/Layout";
import TopTable from "../../components/Table/Top/TopTable";
import Loading from "../../components/Loading/Loading";
import { useSelector } from "react-redux";
import LineChart from "../../components/HighChart/LineChart";
import { START_TIME, END_TIME, API_URL } from "../../constants";

function TokenDetails() {
	const { address } = useSelector((state) => state.token);
	const [isLoading, setIsLoading] = useState(true);

	const [tokenData, setTokenData] = useState(null);
	const [tokenInfo, setTokenInfo] = useState(null);
	const [topTransfers, setTopTransfers] = useState(null);
	const [topWallets, setTopWallets] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

			try {
				// Fetch token data
				const tokenDataResponse = await fetch(
					`https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${address}/market_chart/range?vs_currency=usd&from=${START_TIME}&to=${END_TIME}`
				);
				const tokenData = await tokenDataResponse.json();
				const formattedTokenData = tokenData.prices.map((item) => [
					item[0],
					item[1],
				]);
				setTokenData(formattedTokenData);

				// Fetch token info
				const tokenInfoResponse = await fetch(
					`https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${address}`
				);
				const tokenInfo = await tokenInfoResponse.json();
				const formattedTokenInfo = {
					name: tokenInfo.name,
					symbol: tokenInfo.symbol,
					image: tokenInfo?.image?.large,
					totalSupply: tokenInfo.market_data.total_supply,
					maxSupply: tokenInfo.market_data.max_supply,
					circulatingSupply: tokenInfo.market_data.circulating_supply,
					currentPrice: tokenInfo.market_data.current_price.usd,
					marketCap: tokenInfo.market_data.market_cap.usd,
					tradeUrl: tokenInfo.tickers[0].trade_url,
				};
				setTokenInfo(formattedTokenInfo);

				// Fetch top transfers
				const topTransfersResponse = await fetch(
					`${API_URL}/top-transfers/${address}?limit=5&offset=0`
				);
				const topTransfers = await topTransfersResponse.json();
				setTopTransfers(topTransfers);

				// Fetch top wallets
				const topWalletsResponse = await fetch(
					`${API_URL}/top-wallets/${address}?limit=5&offset=0`
				);
				const topWallets = await topWalletsResponse.json();
				setTopWallets(topWallets);
			} catch (error) {
				console.log(error);
			}

			setIsLoading(false);
		};

		fetchData();
	}, [address]);

	return (
		<Layout>
			<Loading open={isLoading} />
			<div className="token">
				<div className="token-info">
					<div className="token-info__text">
						<div className="token-info__text--image">
							<img
								src={tokenInfo && tokenInfo.image}
								alt={`${tokenInfo && tokenInfo.name} logo`}
							/>
						</div>
						<div className="token-info__text--name">
							{tokenInfo && tokenInfo.name} (
							{tokenInfo && tokenInfo.symbol.toUpperCase()})
							<br />
							Price: ${tokenInfo && tokenInfo.currentPrice}
						</div>
					</div>
					<div className="token-info__number">
						<div className="token-info__number--market-cap">
							Market Cap: ${tokenInfo && tokenInfo.marketCap}
						</div>
						<div className="token-info__number--total-supply">
							Total Supply: {tokenInfo && tokenInfo.totalSupply}
						</div>
						<div className="token-info__number--max-supply">
							Max Supply: {tokenInfo && tokenInfo.maxSupply}
						</div>
						<div className="token-info__number--circulating-supply">
							Circulating Supply: {tokenInfo && tokenInfo.circulatingSupply}
						</div>
					</div>
				</div>
				<div className="token-chart">
					{tokenData && <LineChart data={tokenData} />}
				</div>
				<div className="token-ranking">
					<div className="transfer-ranking">
						{topTransfers && (
							<TopTable
								name="Top Transfers"
								headers={["transaction_hash", "value"]}
								rows={topTransfers}
							/>
						)}
					</div>
					<div className="wallet-transfer-ranking">
						{topWallets && (
							<TopTable
								name="Top Wallets"
								headers={["wallet", "number_of_transfers", "amount"]}
								rows={topWallets}
							/>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default TokenDetails;
