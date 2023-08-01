import { Box } from '@mui/material';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
);

const RadarChart = ({ data }) => {
    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 100,
            }

        }
    }

    return (
        <div>
            <Box sx={{ width: '800px' }}>
                <Radar
                    data={data}
                    options={options}
                />
            </Box>
        </div >
    )
}

export default RadarChart;