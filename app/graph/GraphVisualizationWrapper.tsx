'use client'

import { useState, useEffect } from 'react';
import GraphVisualization from './GraphVisualization';
import { initClientDB, getGraphData } from '../../lib/clientDB';

export default function GraphVisualizationWrapper() {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    async function loadGraphData() {
      await initClientDB();
      const data = await getGraphData();
      setGraphData(data);
    }
    loadGraphData();
  }, []);

  if (!graphData) {
    return <p>グラフデータを読み込んでいます...</p>;
  }

  return <GraphVisualization data={graphData} />;
}