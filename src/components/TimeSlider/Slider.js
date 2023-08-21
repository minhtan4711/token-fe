import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, fromUnixTime } from 'date-fns'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';
import RestartAltSharpIcon from '@mui/icons-material/RestartAltSharp';
import { START_TIME, END_TIME, AN_HOUR } from "../../constants";
import { useDispatch } from 'react-redux';
import { removeDappPerTimestamp } from '../../features/dapp/dappSlice';

function RangeSlider({ handleTimestampChange }) {
    const dispatch = useDispatch();

    const [timestamp, setTimestamp] = useState(START_TIME)
    const [isPlaying, setIsPlaying] = useState(false)
    const timerRef = useRef(null)

    const anHourStep = AN_HOUR
    const startTimestamp = START_TIME
    const endTimestamp = END_TIME

    const handlePlayClick = useCallback(() => {
        setIsPlaying(true);
        dispatch(removeDappPerTimestamp());
    }, [dispatch])

    const handlePauseClick = useCallback(() => {
        setIsPlaying(false);
    }, [])

    useEffect(() => {
        if (isPlaying) {
            // If play button was clicked, start timer
            timerRef.current = setInterval(() => {
                setTimestamp(prevTimestamp => {
                    const nextTimestamp = prevTimestamp + anHourStep;
                    handleTimestampChange(nextTimestamp, nextTimestamp + anHourStep - 1);
                    return nextTimestamp;
                });
            }, 5000);
        } else {
            // If pause button was clicked, clear the timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        // Clear timer when component is unmounted
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [anHourStep, handleTimestampChange, isPlaying]);

    const handleFormatTimestamp = (timestamp) => {
        return format(fromUnixTime(timestamp), 'dd/MM/yyyy HH:mm');
    }

    const handleSliderChange = (event, nextTimestamp) => {
        setTimestamp(nextTimestamp);
    };

    const handleSliderChangeCommitted = (event, nextTimestamp) => {
        dispatch(removeDappPerTimestamp());
        handleTimestampChange(nextTimestamp, nextTimestamp + anHourStep - 1);
    };

    const handleResetTimestamp = () => {
        dispatch(removeDappPerTimestamp());
        setTimestamp(startTimestamp);
        setIsPlaying(false);
        handleTimestampChange(startTimestamp, startTimestamp + anHourStep - 1);
    };

    return (
        <div>
            <Box sx={{ width: 1000, marginTop: '2rem', marginBottom: '3rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Slider
                        aria-label="Small steps"
                        value={timestamp}
                        step={anHourStep}
                        marks
                        min={startTimestamp}
                        max={endTimestamp}
                        valueLabelDisplay='on'
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderChangeCommitted}
                        valueLabelFormat={handleFormatTimestamp}
                    />
                    <IconButton
                        size="large"
                        aria-label="reset app"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleResetTimestamp}
                    >
                        <RestartAltSharpIcon />
                    </IconButton>
                </Box>

                <IconButton
                    sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                    aria-label='play'
                    onClick={isPlaying ? handlePauseClick : handlePlayClick}
                >
                    {isPlaying ? <PauseIcon sx={{ fontSize: '3rem' }} /> : <PlayArrowRounded sx={{ fontSize: '3rem' }} />}
                </IconButton>
            </Box>
        </div>

    );
}

export default React.memo(RangeSlider);