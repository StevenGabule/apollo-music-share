import React, {useContext, useEffect, useState} from "react";
import {
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    IconButton,
} from "@material-ui/core";
import {Pause, PlayArrow, Save} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useMutation, useSubscription} from "@apollo/react-hooks";
import {GET_SONGS} from "../graphql/subscriptions";
import {SongContext} from "../App";
import {ADD_OR_REMOVE_FROM_QUEUE} from "../graphql/mutations";

const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(3)
    },
    songInfoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    songInfo: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    thumbnail: {
        objectFit: 'cover',
        width: 140,
        height: 140
    }
}));

function SongList() {
    const {data, loading, error} = useSubscription(GET_SONGS);

    /*const song = {
        title: 'LINE',
        artist: 'MOON',
        thumbnail: 'https://scontent.fcgy1-1.fna.fbcdn.net/v/t1.0-9/86459023_3027807477238512_8772855763077955584_n.jpg?_nc_cat=100&_nc_sid=85a577&_nc_eui2=AeFkPlzJIz2qwzBPnT-ImEmYPpXvCQ1bpEQ-le8JDVukRP_xTPdtrnHC89BCjCqXOV6CwizAZfiV_SNiB5TkByFj&_nc_ohc=LgiiVywkgswAX_PGKfM&_nc_ht=scontent.fcgy1-1.fna&oh=d522ea99444312549e0ff9e9970eaff4&oe=5EE192DA'
    };*/

    if (loading) {
        return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 50
        }}>
            <CircularProgress/>
        </div>)
    }

    if (error) return <div>Error Fetching songs</div>

    return (
        <div>
            {data.songs.map((song) => (
                <Song key={song.id} song={song}/>
            ))}</div>
    )
}

function Song({song}) {
    const {id} = song;
    const classes = useStyles();
    const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
        onCompleted: data => {
            localStorage.setItem('queue', JSON.stringify(data.addOrRemoveFromQueue));
        }
    });
    const {state, dispatch} = useContext(SongContext);
    const [currentSongPlaying, setCurrentSongPlaying] = useState(false);
    const {title, artist, thumbnail} = song;

    useEffect(() => {
        const isSongPlaying = state.isPlaying && id === state.song.id;
        setCurrentSongPlaying(isSongPlaying);
    }, [id, state.song.id, state.isPlaying]);

    function handleTogglePlay() {
        dispatch({type: 'SET_SONG', payload: {song}});
        dispatch( state.isPlaying ?  {type: 'PAUSE_SONG'} : {type: 'PLAY_SONG'});
    }

    function handleAddOrRemoveFromQueue() {
        addOrRemoveFromQueue({
            variables: { input: { ...song, __typename: 'Song'}}
        });
    }

    return (
        <Card className={classes.container}>
            <div className={classes.songInfoContainer}>
                <CardMedia image={thumbnail} className={classes.thumbnail}/>
                <div className={classes.songInfo}>
                    <CardContent>
                        <Typography gutterBottom variant={'h5'} component={'h2'}>
                            {title}
                        </Typography>
                        <Typography gutterBottom variant={'body1'} component={'p'} color={'textSecondary'}>
                            {artist}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={handleTogglePlay} size={'small'} color={'primary'}>
                            {currentSongPlaying ? <Pause/> : <PlayArrow/>}
                        </IconButton>
                        <IconButton onClick={handleAddOrRemoveFromQueue} size={'small'} color={'secondary'}>
                            <Save/>
                        </IconButton>
                    </CardActions>
                </div>
            </div>
        </Card>)
}

export default SongList;
