import React from 'react';
import {
    Typography,
    Avatar,
    IconButton,
    makeStyles,
    useMediaQuery
} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

function QueuedSongList() {
    const greaterThanMD =
        useMediaQuery(theme => theme.breakpoints.up('md'));

    const song = {
        title: 'LINE',
        artist: 'MOON',
        thumbnail: 'https://scontent.fcgy1-1.fna.fbcdn.net/v/t1.0-9/86459023_3027807477238512_8772855763077955584_n.jpg?_nc_cat=100&_nc_sid=85a577&_nc_eui2=AeFkPlzJIz2qwzBPnT-ImEmYPpXvCQ1bpEQ-le8JDVukRP_xTPdtrnHC89BCjCqXOV6CwizAZfiV_SNiB5TkByFj&_nc_ohc=LgiiVywkgswAX_PGKfM&_nc_ht=scontent.fcgy1-1.fna&oh=d522ea99444312549e0ff9e9970eaff4&oe=5EE192DA'
    };

    return greaterThanMD && (
        <div style={{margin: '10px 0'}}>
            <Typography color={'textSecondary'} variant={'button'}>
                QUEUE (5)
            </Typography>
            {Array.from({length: 5}, () => song).map((song, i) => (
                <QueuedSong key={i} song={song}/>
            ))}
        </div>
    );
}

const useStyles = makeStyles({
    avatar: {
        width: 44,
        height:44
    },
    text: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    container: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '50px auto 50px',
        gridGap: 12,
        alignItems: 'center',
        marginTop: 10
    },
    songInfoContainer: {
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    }
});

function QueuedSong({song}) {
    const classes = useStyles();
    const {title, artist, thumbnail} = song;
    return (
        <div className={classes.container}>
            <Avatar src={thumbnail} alt={'song thumbnail'} className={classes.avatar} />
            <div className={classes.songInfoContainer}>
                <Typography variant={'subtitle2'} className={classes.text}>
                    {title}
                </Typography>
                <Typography className={classes.text} color={'textSecondary'} variant={'body2'}>
                    {artist}
                </Typography>
            </div>
            <IconButton>
                 <Delete color={'error'} />
            </IconButton>
        </div>
    )
}

export default QueuedSongList;
