import React, { useRef, useEffect } from 'react';
import ForceGraph3D from '3d-force-graph';
import { SphereGeometry, MeshPhongMaterial, Mesh } from 'three';
import LoadingScreen from "../../Loading/Loading";
import SpriteText from 'three-spritetext';

const colorMap = {
  LOW: "#F89A99",
  MEDIUM: "#CAB2D6",
  HIGH: "#F67F03",
};

const linkMap = {
  LOW: "#F89A99",
  MEDIUM: "#CAB2D6",
  HIGH: "#F67F03",
};

const DynamicForceGraph3D = ({ data, width, height, loading }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    const graph = ForceGraph3D({ controlType: 'orbit' })(graphRef.current)
      .width(width)
      .height(height)
      .graphData(data)
      .warmupTicks(200)
      .cooldownTicks(0)
      .nodeLabel('id')
      .nodeResolution(8)
      .linkLabel(l => {
        if (l.numberOfTransfer > 0) {
          return `${l.numberOfTransfer} time(s) with ${l.totalValue} token unit`;
        }
      })
      .linkWidth(l => Math.log(l.totalValue) / 4)
      .nodeAutoColorBy('group')
      .linkDirectionalParticles("numberOfTransfer")
      .linkDirectionalParticleSpeed(l => l.numberOfTransfer * 0.0001)
      .linkThreeObjectExtend(true)
      .linkThreeObject(link => {
        if (link.numberOfTransfer > 10) {
          const sprite = new SpriteText(`${link.numberOfTransfer} times`);
          sprite.color = 'lightgrey';
          sprite.textHeight = 1.5;
          return sprite;
        }
      })
      .linkPositionUpdate((sprite, { start, end }) => {
        if (sprite) {
          const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
            [c]: start[c] + (end[c] - start[c]) / 2 + 12 // calc middle point
          })));

          // Position sprite
          Object.assign(sprite.position, middlePos);
        }
      })
      .nodeThreeObject(node => {
        if (node.balance <= 0 || isNaN(node.balance)) {
          node.balance = 10;
        }
        const sphereGeometry = new SphereGeometry((node.balance));
        const sphereMaterial = new MeshPhongMaterial({
          color: colorMap[node.group]
        });
        return new Mesh(sphereGeometry, sphereMaterial);
      });

    // const additionalLinks = [];
    // const groupNodes = { LOW: [], MEDIUM: [], HIGH: [] };

    // data.nodes.forEach(node => {
    //   groupNodes[node.group].push(node.id);
    // });

    // for (const group in groupNodes) {
    //   const nodes = groupNodes[group];
    //   nodes.forEach((node, i) => {
    //     for (let j = i + 1; j < nodes.length; j++) {
    //       additionalLinks.push({
    //         source: node,
    //         target: nodes[j],
    //         isGroupLink: true,
    //         group: group,
    //       });
    //     }
    //   });
    // }

    // graph.graphData({
    //   nodes: data.nodes,
    //   links: [...data.links, ...additionalLinks]
    // });

    // graph.linkColor(link => link.isGroupLink ? linkMap[link.group] : 'red');
    graph.d3Force('charge').strength(-1000);
    graph.onEngineStop(() => graph.zoomToFit(500));

  }, [data, height, width])

  return (
    <div>
      {
        loading ?
          <LoadingScreen />
          :
          <div ref={graphRef}></div>
      }

    </div>
  );
}

export default DynamicForceGraph3D;