import React from 'react';
import {render} from 'react-dom';
import App from './App';
import {MuiThemeProvider} from '@material-ui/core'
import theme from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import {ApolloProvider} from '@apollo/react-hooks'
import client from "./graphql/client";

render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <App/>
            </MuiThemeProvider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
