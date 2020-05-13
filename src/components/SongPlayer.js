import React, {useContext, useEffect, useRef, useState} from "react";
import QueuedSongList from "./QueuedSongList";
import {
    CardMedia,
    Slider,
    IconButton,
    Card,
    Typography,
    CardContent,
    makeStyles
} from "@material-ui/core";
import {Pause, PlayArrow, SkipNext, SkipPrevious} from "@material-ui/icons";
import {SongContext} from "../App";
import {useQuery} from "@apollo/react-hooks";
import {GET_QUEUED_SONGS} from "../graphql/queries";
import ReactPlayer from "react-player";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 15px'
    },
    content: {
        flex: '1 0 auto'
    },
    thumbnail: {
        width: 150
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    playIcon: {
        height: 38,
        width: 38,
    }
}));

function SongPlayer() {
    const {data} = useQuery(GET_QUEUED_SONGS);
    const {state, dispatch} = useContext(SongContext);
    const [played, setPlayed] = useState(0);
    const [playedSeconds, setplayedSeconds] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const reactPlayerRef = useRef();
    const [positionInQueue, setPositionInQueue] = useState(0);
    const classes = useStyles();

    useEffect(() => {
        const songIndex = data.queue.findIndex(song => song.id === state.song.id);
        setPositionInQueue(songIndex)
    }, [state.song.id, data.queue]);

    useEffect(() => {
        const nextSong = data.queue[positionInQueue + 1];
        if (played >= 0.99 && nextSong) {
            setPlayed(0);
            dispatch({type: "SET_SONG", payload: { song: nextSong}})
        }
    }, [data.queue, played, dispatch, positionInQueue]);

    function handleTogglePlay() {
        dispatch( state.isPlaying ?  {type: 'PAUSE_SONG'} : {type: 'PLAY_SONG'});
    }

    function handleProgressChange(_, newValue) {
        setPlayed(newValue);
    }

    function handleSeekMouseDown() {
        setSeeking(true);
    }

    function handleSeekMouseUp() {
        setSeeking(false);
        reactPlayerRef.current.seekTo(played);
    }

    function formatDuration(seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    function handlePlayNextSong() {
        const nextSong = data.queue[positionInQueue + 1];
        if (nextSong) {
            dispatch({type: "SET_SONG", payload: {song: nextSong}});
        }
    }

    function handlePrevSong() {
        const prevSong = data.queue[positionInQueue - 1];
        if (prevSong) {
            dispatch({type: "SET_SONG", payload: {song: prevSong}});
        }
    }

    return (
        <>
            <Card variant={'outlined'} className={classes.container}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant={'h5'} component={'h3'}>
                            {state.song.title}
                        </Typography>
                        <Typography variant={'subtitle1'} component={'p'} color={'textSecondary'}>
                            {state.song.artist}
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton onClick={handlePrevSong}>
                            <SkipPrevious />
                        </IconButton>
                        <IconButton onClick={handleTogglePlay}>
                            {state.isPlaying ? <Pause className={classes.playIcon} /> : <PlayArrow className={classes.playIcon} />}
                        </IconButton>
                        <IconButton onClick={handlePlayNextSong}>
                            <SkipNext />
                        </IconButton>
                        <Typography variant={'subtitle1'} component={'p'} color={'textSecondary'}>
                            {formatDuration(playedSeconds)}
                        </Typography>
                    </div>
                    <Slider
                        onChange={handleProgressChange}
                        onMouseDown={handleSeekMouseDown}
                        onMouseUp={handleSeekMouseUp}
                        value={played}
                        type={"range"}
                        min={0}
                        max={1}
                        step={0.01}/>
                </div>
                <ReactPlayer
                    ref={reactPlayerRef}
                    onProgress={({played, playedSeconds}) => {
                        if (!seeking) {
                            setPlayed(played);
                            setplayedSeconds(playedSeconds)
                        }
                    }}
                    url={state.song.url}
                    playing={state.isPlaying}
                    hidden />
                <CardMedia className={classes.thumbnail} image={state.song.thumbnail} />
            </Card>
            <QueuedSongList queue={data.queue} />
        </>
    )
}

export default SongPlayer;
