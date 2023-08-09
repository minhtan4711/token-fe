import React, { useState, useEffect } from "react";
import TransferModal from "../../Modal/Modal";
import { ForceGraph2D } from "react-force-graph";
import "./ForceGraph2D.css";

const DynamicGraph = ({ data }) => {
    const [images, setImages] = useState({});

    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = data.nodes.map(node => {
                return new Promise((resolve, reject) => {
                    if (node.group.startsWith('DAPP_') && node.image) {
                        const img = new Image();
                        img.onload = () => resolve({ id: node.id, img });
                        img.onerror = reject;
                        img.src = node.image;
                    } else {
                        resolve({ id: node.id, img: null });
                    }
                });
            });

            const images = await Promise.all(imagePromises);
            const imageMap = {};
            images.forEach(({ id, img }) => {
                imageMap[id] = img;
            });
            setImages(imageMap);
        };

        loadImages();
    }, [data.nodes]);


    const nodeVal = (node) => {
        if (node.balance === 0 || node.balance < 1) {
            return 5;
        } else if (node.balance <= 1000) {
            return 10 + Math.ceil(Math.log(node.balance));
        } else {
            return Math.ceil(Math.log(node.balance));
        }
    }

    const nodeCanvasObject = (node, ctx, globalScale) => {
        const label = `${node.group}`;
        const fontSize = 12 / globalScale;
        ctx.color = 'white';
        ctx.font = `${fontSize}px Sans-Serif`;

        let color;
        switch (node.group) {
            case 'LOW':
                color = '#C51605';
                break;
            case 'MEDIUM':
                color = '#FD8D14';
                break;
            case 'HIGH':
                color = '#4682A9';
                break;
            case 'WHALE':
                color = '#9288F8';
                break;
            default:
                color = 'gray';
                break;
        }

        if (node.group.startsWith('DAPP_') && images[node.id]) {
            const radius = nodeVal(node) * 1.5;
            ctx.save();
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(images[node.id], node.x - radius, node.y - radius, radius * 2, radius * 2);
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
            ctx.clip();
            ctx.closePath();
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeVal(node), 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
        }

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, node.x, node.y);
    }

    const [selectedNode, setSelectedNode] = useState(null);
    const handleNodeClick = (node) => {
        setSelectedNode(node);
    }
    const handleCloseModal = () => {
        setSelectedNode(null);
    }

    return (
        <>
            <ForceGraph2D
                graphData={data}
                width={800}
                height={800}
                d3={d3 => d3.forceManyBody().strength(-1000)}
                cooldownTicks={300}
                warmupTicks={300}
                minZoom={2}
                maxZoom={10}
                nodeCanvasObject={nodeCanvasObject}
                nodeLabel={(node) => {
                    if (node.addresses.length === 1) {
                        return `${node.group} group: ${node.addresses[0]}`;
                    }
                    return `${node.group} group: ${node.addresses.length} addresses`;
                }}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                    node.fz = node.z;
                }}
                onNodeClick={handleNodeClick}
                linkLabel={(link) => `Total Value: ${link.totalValue}`}
                linkCurvature="curvature"
                linkCurveRotation="rotation"
                linkDirectionalParticles={l =>
                    l.totalValue > 0 ? Math.ceil(Math.log(l.totalValue / 2)) : 2}
                linkDirectionalParticleSpeed={(l) =>
                    l.numberOfTransfer > 0 ? l.numberOfTransfer * 0.001 : 0.1}
                linkDirectionalParticleWidth={3}
                linkHoverPrecision={8}
            />
            {
                selectedNode && (
                    <TransferModal
                        open={selectedNode !== null}
                        data={selectedNode}
                        headers={["from", "to", "value"]}
                        handleClose={handleCloseModal}
                    />
                )
            }
        </>
    );
};

export default DynamicGraph;
