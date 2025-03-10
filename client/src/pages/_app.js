import { useEffect, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { Toaster } from "react-hot-toast";
import { Provider as ReduxProvider } from "react-redux";
import nProgress from "nprogress";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { RTL } from "../components/rtl";
import "../styles/global.css"
import { SettingsButton } from "../components/settings-button";
import { SplashScreen } from "../components/splash-screen";
import {
  SettingsConsumer,
  SettingsProvider,
} from "../contexts/settings-context";
import { AuthConsumer, AuthProvider } from "../contexts/firebase-auth-context";
import AlertContext from '../contexts/alert-context'
import { gtmConfig } from "../config";
import { gtm } from "../lib/gtm";

import { createTheme } from "../theme";
import { createEmotionCache } from "../utils/create-emotion-cache";
import "../i18n";
import { store } from "../store";
import { Alert, Snackbar } from "@mui/material";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const [snacky, setSnacky] = useState({
    color: "success",
    message: "Updated Successfully",
    open: false,
  })
  const details = {
    snacky,
    setSnacky
  }

  const handleClose = () => {
    setSnacky({
      open: false
    }
    )
  }

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);
  console.log('app.js')

  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Cyber Click</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ReduxProvider store={store}>
          <AlertContext.Provider value={details}>
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
            <AuthProvider>
              <SettingsProvider>
                <SettingsConsumer>
                  {({ settings }) => (
                    <ThemeProvider
                      theme={createTheme({
                        direction: settings.direction,
                        responsiveFontSizes: settings.responsiveFontSizes,
                        mode: settings.theme,
                      })}
                    >
                      <RTL direction={settings.direction}>
                        <CssBaseline />
                        <Toaster position="top-center" />
                        {/* <SettingsButton /> */}
                        <AuthConsumer>
                          {(auth) =>
                            !auth.isInitialized ? (
                              <SplashScreen />
                            ) : (
                              getLayout(<Component {...pageProps} />)
                            )
                          }
                        </AuthConsumer>
                      </RTL>
                    </ThemeProvider>
                  )}
                </SettingsConsumer>
              </SettingsProvider>
            </AuthProvider>
            {/* </LocalizationProvider> */}
          </AlertContext.Provider>
        </ReduxProvider>
      </CacheProvider>
      <Snackbar open={snacky.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
        <Alert onClose={handleClose} severity={snacky.color} sx={{ width: '100%' }}>
          {snacky.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
