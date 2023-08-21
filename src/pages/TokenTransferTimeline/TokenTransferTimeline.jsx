import React, { useState, useEffect, useCallback } from "react";
import "./TokenTransferTimeline.css";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading/Loading";
import TopTable from "../../components/Table/Top/TopTable";
import RangeSlider from "../../components/TimeSlider/Slider";
import DynamicGraph from "../../components/Graph/ForceGraph2D/ForceGraph2D";
import RadarChart from "../../components/HighChart/RadarChart";
import { API_URL } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import {
	selectTimestamp,
	clearTimestamp,
} from "../../features/timestamp/timestampSlice";

function TokenTransferTimeline() {
	const dispatch = useDispatch();

	const { address } = useSelector((state) => state.token);
	const { dappId } = useSelector((state) => state.dapp);
	const { start_timestamp, end_timestamp } = useSelector(
		(state) => state.timestamp
	);

	const width = 200;
	const height = "100%vh";

	const deepCopy = (data) => JSON.parse(JSON.stringify(data));

	const formatGraphData = (data) => {
		const { timestamp, ...filteredData } = data[0];
		const newFilteredData = filteredData.links.map((link) => {
			if (link.source === link.target) {
				return {
					...link,
					curvature: 1,
					rotation: 1,
				};
			} else {
				return link;
			}
		});

		// Get all unique source and target nodes from links
		let linkedNodes = new Set();
		newFilteredData.forEach((link) => {
			linkedNodes.add(link.source);
			linkedNodes.add(link.target);
		});

		// Filter out nodes that do not appear in links
		let filteredNodes = filteredData.nodes.filter((node) =>
			linkedNodes.has(node.id)
		);

		return {
			nodes: filteredNodes,
			links: newFilteredData,
		};
	};

	const formatDappsData = (data) => {
		return data.map((dapp) => {
			return {
				id: dapp.id,
				name: dapp.name,
				image: dapp.image,
			};
		});
	};

	const initialRadarData = [1, 1, 1, 1, 1, 1, 1];

	const initialGraphData = {
		nodes: [
			{ id: "LOW", group: "LOW", balance: 5 },
			{ id: "MEDIUM", group: "MEDIUM", balance: 24 },
			{ id: "HIGH", group: "HIGH", balance: 3 },
		],
		links: [
			{
				source: "LOW",
				target: "LOW",
				totalValue: 5,
				numberOfTransfer: 2,
				curvature: 0.6,
				rotation: 0.5,
			},
			{ source: "LOW", target: "MEDIUM", totalValue: 10, numberOfTransfer: 2 },
		],
	};

	const [prevTimestamp, setPrevTimestamp] = useState(null);
	const [nextTimestamp, setNextTimestamp] = useState(null);

	const handleTimestampChange = useCallback(
		(prevTimestamp, nextTimestamp) => {
			if (start_timestamp !== "" && end_timestamp !== "") {
				dispatch(
					clearTimestamp({
						start_timestamp: prevTimestamp,
						end_timestamp: nextTimestamp,
					})
				);
				setPrevTimestamp(prevTimestamp);
				setNextTimestamp(nextTimestamp);
				dispatch(
					selectTimestamp({
						start_timestamp: prevTimestamp,
						end_timestamp: nextTimestamp,
					})
				);
			} else {
				dispatch(
					selectTimestamp({
						start_timestamp: prevTimestamp,
						end_timestamp: nextTimestamp,
					})
				);
				setPrevTimestamp(prevTimestamp);
				setNextTimestamp(nextTimestamp);
			}
		},
		[dispatch, end_timestamp, start_timestamp]
	);

	const [radarData, setRadarData] = useState(initialRadarData);
	const [graphData, setGraphData] = useState(initialGraphData);
	const [isLoading, setIsLoading] = useState(false);
	const [dapps, setDapps] = useState([]);

	useEffect(() => {
		if (prevTimestamp !== null && nextTimestamp !== null) {
			setIsLoading(true);
			const fetchData = async () => {
				try {
					const dappList = dappId.join(",");
					const responseRadar = await fetch(
						`${API_URL}/token-transfer/${address}?start_timestamp=${prevTimestamp}&end_timestamp=${nextTimestamp}`
					);
					const responseGraph = await fetch(
						`${API_URL}/graph-data/${address}?start_timestamp=${prevTimestamp}&end_timestamp=${nextTimestamp}&dapp_id=${dappList}`
					);
					const responseDapps = await fetch(
						`${API_URL}/dapp-at-timestamp/${address}?start_timestamp=${prevTimestamp}&end_timestamp=${nextTimestamp}`
					);

					const dataRadar = await responseRadar.json();
					const dataGraph = await responseGraph.json();
					const dataDapps = await responseDapps.json();

					if (dataDapps.length > 0) {
						const newDataDapps = formatDappsData(dataDapps);
						setDapps(newDataDapps);
					}

					if (dataGraph.length > 0) {
						const newDataGraph = formatGraphData(dataGraph);
						const dataGraphCopy = deepCopy(newDataGraph);
						setGraphData(dataGraphCopy);
					}

					if (dataRadar) {
						const timestampKey = Object.keys(dataRadar)[0];
						const dataAtTimestampKey = dataRadar[timestampKey];
						const dataForRadarChart = [
							dataAtTimestampKey.numberOfTransferChangeLogs,
							dataAtTimestampKey.tradingVolumeChanges,
							dataAtTimestampKey.numberOfDappChangeLogs,
							dataAtTimestampKey.numberOfHolderChangeLogs,
							dataAtTimestampKey.numberOfWhaleWalletChangeLogs,
							dataAtTimestampKey.averageNumberOfTransactionPerDay,
							dataAtTimestampKey.numberOfAddressChangeLogs,
						];
						setRadarData(dataForRadarChart);
					} else {
						setRadarData(initialRadarData);
					}

					setIsLoading(false);
				} catch (error) {
					setIsLoading(false);
					console.log(error);
				}
			};

			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prevTimestamp, nextTimestamp, address, dappId]);

	return (
		<Layout>
			<Loading open={isLoading} />
			<div className="App">
				<div className="container">
					<>
						<div className="container-range">
							<RangeSlider handleTimestampChange={handleTimestampChange} />
						</div>
						{start_timestamp !== "" ? (
							<>
								<div className="container-table">
									{dapps && (
										<TopTable
											width={400}
											name="Dapps"
											headers={["image", "id", "name"]}
											rows={dapps}
										/>
									)}
								</div>
								<div className="container-info">
									<div className="radar-chart">
										<RadarChart data={radarData} />
									</div>
									<div className="force-graph">
										<DynamicGraph
											data={graphData}
											width={width}
											height={height}
										/>
									</div>
								</div>
							</>
						) : (
							<h2 style={{ textAlign: "center", lineHeight: "2rem" }}>
								Please click the play button to start the visualization.
							</h2>
						)}
					</>
				</div>
			</div>
		</Layout>
	);
}

export default TokenTransferTimeline;
