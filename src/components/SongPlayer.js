import React from "react";
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
import {PlayArrow, SkipNext, SkipPrevious} from "@material-ui/icons";

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
    const classes = useStyles();
    return (
        <>
            <Card variant={'outlined'} className={classes.container}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant={'h5'} component={'h3'}>
                            Title
                        </Typography>
                        <Typography variant={'subtitle1'} component={'p'} color={'textSecondary'}>
                            Artist
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton>
                            <SkipPrevious />
                        </IconButton>
                        <IconButton>
                            <PlayArrow className={classes.playIcon} />
                        </IconButton>
                        <IconButton>
                            <SkipNext />
                        </IconButton>
                        <Typography variant={'subtitle1'} component={'p'} color={'textSecondary'}>
                            00:01:30
                        </Typography>
                    </div>
                    <Slider type={"range"} min={0} max={1} step={0.01}/>
                </div>
                <CardMedia className={classes.thumbnail} image={'https://scontent.fcgy1-1.fna.fbcdn.net/v/t1.0-9/86459023_3027807477238512_8772855763077955584_n.jpg?_nc_cat=100&_nc_sid=85a577&_nc_eui2=AeFkPlzJIz2qwzBPnT-ImEmYPpXvCQ1bpEQ-le8JDVukRP_xTPdtrnHC89BCjCqXOV6CwizAZfiV_SNiB5TkByFj&_nc_ohc=LgiiVywkgswAX_PGKfM&_nc_ht=scontent.fcgy1-1.fna&oh=d522ea99444312549e0ff9e9970eaff4&oe=5EE192DA'} />
            </Card>
            <QueuedSongList/>
        </>
    )
}

export default SongPlayer;
