import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

import React, { useEffect, useState, useMemo } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  FpxBankElement,
} from "@stripe/react-stripe-js";
import Head from "next/head";

import { API_SERVICE, WEBSITE_URL } from "../../config";
import CustomSnackbar from "../custom-snackbar";
import { useAuth } from "../../hooks/use-auth";

import countryList from "react-select-country-list";

export default function FPXForm({ handleBack, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");

  const [step, setstep] = useState(0);
  const countries = useMemo(() => countryList().getData(), []);

  const [details, setDetails] = useState({
    // name: "Demo User",
    // address: "B 345, sherlock lane",
    // city: "New York",
    // zip: "83888",
    // country: "US",
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    // let { error: stripeError, paymentIntent } = await stripe.confirmFpxPayment(
    //   clientSecret,
    //   {
    //     payment_method: {
    //       fpx: elements.getElement(FpxBankElement),
    //     },
    //     return_url: `${window.location.origin}/fpx?return=true`,
    //   }
    // );
    await stripe
      .confirmFpxPayment(clientSecret, {
        payment_method: {
          fpx: elements.getElement(FpxBankElement),
          billing_details: {
            name: details.name,
            address: {
              line1: details.address,
              postal_code: details.zip,
              city: details.city,
              country: details.country,
            },
          },
        },
        return_url: `${WEBSITE_URL}/payment-details`,
      })
      .then(async function (result) {
        console.log(result);
        const { paymentIntent, error } = result;
        if (error) {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setMessage(error.message);
            setSeverity("error");
            setOpen(true);
            setLoading(false);
          } else {
            console.log(error);
            setMessage("An unexpected error occurred.");
            setSeverity("error");
            setOpen(true);
            setLoading(false);
          }
        } else {
          if (paymentIntent.status === "succeeded") {
            const { currency, amount, customer } = paymentIntent;
            const response = await fetch(`${API_SERVICE}/addFunds`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                currency,
                amount,
                userId: user.id,
              }),
            });
            if (response.status == 200) {
              setMessage("Funds added to wallet");
              setSeverity("success");
              setOpen(true);
              setLoading(false);
            } else {
              setMessage("An Unknown error occurred");
              setSeverity("error");
              setOpen(true);
              setLoading(false);
            }
          } else {
            setMessage(paymentIntent.status);
            setSeverity("error");
            setOpen(true);
            setLoading(false);
          }
        }
      });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.

    // setIsLoading(false);
  };

  return (
    <>
      <div>
        <Head>
          <title>Test</title>
          <link href="/static/card-section.css" rel="stylesheet" key="test" />
        </Head>
      </div>
      <label>
        <Box
          maxWidth="600px"
          sx={{
            margin: "40px auto",
            border: 1.5,
            backgroundColor: "background.paper",
            borderColor: "black",
            p: 5,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                required
                value={details.name}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={12}>
               <CardElement></CardElement>
             </Grid> */}
            <Grid item md={12} xs={12}>
              <h4>Billing Details</h4>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address"
                required
                value={details.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={details.country}
                  label="Country"
                  name="country"
                  onChange={handleChange}
                >
                  {countries?.map((country) => {
                    return (
                      <MenuItem value={country.value} key={country.value}>
                        {country.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                value={details.zip}
                fullWidth
                label="Zip"
                name="zip"
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                value={details.city}
                fullWidth
                label="City"
                name="city"
                required
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ py: 4 }}>
                {step === 1 ? (
                  <>
                    <h4>Please select bank</h4>
                    <FpxBankElement
                      options={{ accountHolderType: "individual" }}
                    />
                  </>
                ) : null}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                // mt={12}
                alignItems="center"
                justifyContent="space-between"
                display="flex"
              >
                <div onClick={handleBack}>Go Back</div>

                {step === 0 ? (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => setstep(1)}
                    style={{ paddingLeft: "40px", paddingRight: "40px" }}
                  >
                    Continue
                  </Button>
                ) : step === 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                    style={{ paddingLeft: "40px", paddingRight: "40px" }}
                  >
                    {loading ? "Loading" : "Add Funds"}
                  </Button>
                ) : null}
              </Box>
            </Grid>

            <CustomSnackbar
              open={open}
              setOpen={setOpen}
              message={message}
              severity={severity}
            />
          </Grid>
        </Box>
      </label>
    </>
  );
}
