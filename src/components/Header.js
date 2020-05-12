import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {HeadsetTwoTone} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    title: {
        marginLeft: theme.spacing(2)
    }
}));

function Header() {
    const classes = useStyles();
    return (
        <AppBar className={'primary'} position={'fixed'}>
            <Toolbar>
                <HeadsetTwoTone/>
                <Typography className={classes.title} variant={"h6"} component={'h1'}>
                    Apollo Music Shared
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Header;
