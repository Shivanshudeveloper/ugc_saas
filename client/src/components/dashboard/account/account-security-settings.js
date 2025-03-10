import { useState,useEffect,useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  
} from "@mui/material";
import { ArrowRight as ArrowRightIcon } from "../../../icons/arrow-right";
import { Scrollbar } from "../../scrollbar";

import * as React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl,InputLabel, Select,MenuItem  } from '@mui/material';
import moment from 'moment';



import firebase from "firebase/app";
import "firebase/auth";
import { useAuth } from "../../../hooks/use-auth";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditIcon from '@mui/icons-material/Edit';
import { API_SERVICE } from "../../../config";

import countryList from "react-select-country-list";

import {
  PaymentElement,
  useStripe,
 
} from "@stripe/react-stripe-js";

export const AccountSecuritySettings = () => {
  
   const { signInWithEmailAndPassword ,user} = useAuth();
   const [amount, setAmount] = useState(user?.userData?.funds?.amount);
  const [currency, setCurrency] = useState(user?.userData?.funds?.currency);
 const countries = useMemo(() => countryList().getData(), []);

 

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
   const [openPaymentSnack, setOpenPaymentSnack] = useState(false);
  const [severity, setSeverity] = useState("");


   const [details, setDetails] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
    country: "US",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("12345678");
  const [oldPassword, setOldPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState([]);
const [update, setUpdate] = useState(false);
 

   useEffect(() => {
    console.log("This should print");
    handleWallet();
      getPaymentsDetails();
    getWallet();
  }, [user?.userData?.funds?.selectedCurrency, user?.userData?.funds?.amount]);



  const getPaymentsDetails = async () => {
    try {
      await fetch(`${API_SERVICE}/get_payment_details/${user.email}`)
        .then(res => res.json())
        .then(json => {
          setDetails(json[0]);
            if(json.length>0){
            setUpdate(true)
          }
        console.log(json)
        });
    } catch (err) {
      console.log(err);
    }
  };

   const getWallet = async () => {
    debugger;
    try {
      await fetch(
`${API_SERVICE}/get_wallet/${user.email}`)
            .then((res) => res.json())
            .then((json) => {
                setTransactionDetails(json)
                  console.log(res.json())
            });

      // const response = await fetch(`${API_SERVICE}/get_wallet/${user.email}`, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      // });
      // if (response.status === 200) {
      //  console.log(response.body)
      // }
    } catch (err) {
      console.log(err);
    }
  };

   const handleWallet = async () => {
    if (user?.userData?.funds?.amount === 0) {
      setAmount(0);
      setCurrency(user?.userData?.funds?.selectedCurrency || "USD");
      return;
    }
    try {
      const response = await fetch(`${API_SERVICE}/convert-currency`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: user?.userData?.funds?.currency,
          to: user?.userData?.funds?.selectedCurrency,
          amount: user?.userData?.funds?.amount,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setAmount(data);
        setCurrency(user?.userData?.funds?.selectedCurrency);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReLogin = async () => {
    const firebaseUser = firebase.auth().currentUser;
    setDialogOpen(false);
    console.log(oldPassword);
    try {
      await signInWithEmailAndPassword(firebaseUser.email, oldPassword);
    } catch (error) {
      console.log(error);
    }
    firebaseUser
      .updatePassword(password)
      .then(() => {
        // Update successful.
        console.log("Update Successful");
        handleClick();
        setIsEditing(false);
      })
      .catch((error) => {
        // An error ocurred
        // ...
        console.log(error);
      });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setDialogOpen(true);
  };

  const getCurrentDate = () =>{
    debugger;
    return new Date().toISOString().slice(0, 10)
  }


    const handleSubmit = async () => {
      if(update==true){
 try {
      const response = await fetch(`${API_SERVICE}/update_payment/${user.email}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           email: user.email,
          name: details.name,
          street: details.street,
          city: details.city,
          country:details.country,
          zip:details.zip
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
       setOpenPaymentSnack(true)
      }
    } catch (error) {
      console.log(error);
    }

   
      }
      else{

      
    try {
      const response = await fetch(`${API_SERVICE}/add_payment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:user.email,
          name: details.name,
          street: details.street,
          city: details.city,
          country:details.country,
          zip:details.zip
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
       setOpenPaymentSnack(true)
      }
    } catch (error) {
      console.log(error);
    }
      }
   
          } 
       
          const getCreatedDate = (createdDate)=>{
           return moment(createdDate).format('MMMM Do YYYY, h:mm:ss a')
          }
         
  

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={3} style={{display:'flex', flexDirection:'column', width:"100%"}}>
            <Grid item >
              {/* <Typography variant="h6">Change password</Typography> */}
              <Box display='flex' style={{ width:'100%', justifyContent:'space-between'}}>
                  <Typography variant="h6">Password</Typography>
                  <Button 
                    onClick={isEditing ? handleSave : handleEdit}
                  // onClick={handleOpenProfile}
                  >
                    {
                      isEditing ? "Save" : <EditIcon/>
                    }
                    
                  </Button>
                </Box>
            </Grid>
            <Grid item md={8} sm={12} xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  disabled={!isEditing}
                  label="Password"
                  type="password"
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                    ...(!isEditing && {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderStyle: "dotted",
                      },
                    }),
                  }}
                />
                {/* <Button onClick={isEditing ? handleSave : handleEdit}>
                  {isEditing ? "Save" : "Edit"}
                </Button> */}

                {/* {  <Typography>Password</Typography>} */}
              </Box>
              {/* <Box>
                {password}
              </Box> */}
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>ReLogin</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To change your password, please ReLogin with your old
                    password
                  </DialogContentText>
                  <TextField
                    value={oldPassword}
                    type="password"
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Password"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleReLogin}>Submit</Button>
                </DialogActions>
              </Dialog>

              <Snackbar
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                open={open}
                onClose={handleClose}
              >
                <Alert onClose={handleClose} severity="success">
                  "Password Updated Successfully"
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

<Snackbar
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                open={openPaymentSnack}
                onClose={handleClose}
              >
                <Alert onClose={handleClose} severity="success">
                  "Payment details added successfully"
                </Alert>
              </Snackbar>

<Card  style={{marginTop:'40px'}}>
        <CardContent>
          <Grid container spacing={3} style={{ display:'flex', flexDirection:'column', width:"100%"}}>
            <Grid item >
              {/* <Typography variant="h6">Change password</Typography> */}
              <Box display='flex' style={{ width:'100%', justifyContent:'space-between'}}>
                  <Typography variant="h6">Transaction Details</Typography>
                </Box>
            </Grid>
             {transactionDetails.map((transaction) => (
            <Grid style={{paddingLeft:'24px'}}>
            
               
            <Grid item md={8} sm={12} xs={12}>
               <Box
                  sx={{
                    display: "flex",
                    mt: 3,
                    alignItems: "center",
                  }}
                >
                  <Typography style={{color:'grey'}}>Transaction Amount</Typography>
                </Box>
                <Box>
                  <Typography>  {`Wallet ${transaction.funds.amount} ${transaction.funds.currency}`}</Typography>
                </Box>
            </Grid>
             <Grid item md={8} sm={12} xs={12}>
               <Box
                  sx={{
                    display: "flex",
                    mt: 3,
                    alignItems: "center",
                  }}
                >
                  <Typography style={{color:'grey'}}>Current date</Typography>
                </Box>
                <Box>
                  <Typography>{getCreatedDate(transaction.createdDate)}</Typography>
                </Box>
            </Grid>
             </Grid>
                  ))}
                 

          </Grid>
        </CardContent>
      </Card>

      <Card  style={{marginTop:'40px'}}>
        <CardContent>
          <Grid container spacing={3} style={{ display:'flex', flexDirection:'column', width:"100%"}}>
            <Grid item >
             
              
                <Grid item md={12} xs={12}>
              <h4>Payment Details</h4>
            </Grid>
        
          <Box>
               <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Holder Name"
                name="name"
                required
                value={details?.name}
                onChange={handleChange}
              />
            </Grid>
         
            {/* <Grid item md={12} xs={12}>
              <h4>Billing Details</h4>
            </Grid> */}
            <Grid item md={6} xs={12}>
              <TextField
                autoFocus
                fullWidth
                label="Street Address"
                name="street"
                required
                value={details?.street}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={details?.country}
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
                value={details?.zip}
                fullWidth
                label="Zip"
                name="zip"
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                value={details?.city}
                fullWidth
                label="City"
                name="city"
                required
                onChange={handleChange}
              />
            </Grid>
           
            <Grid item xs={12}>
              
               
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  {loading ? "Loading" : "Add"}
                </Button>
             
              
            </Grid>
             </Grid>
            
 </Box>
  
            {/* <CustomSnackbar
              open={open}
              setOpen={setOpen}
              message={message}
              severity={severity}
            /> */}
          </Grid>

          </Grid>
        </CardContent>

          
      </Card>

      {/* <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6">Multi Factor Authentication</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={4}>
              <Grid item sm={6} xs={12}>
                <Card sx={{ height: "100%" }} variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "block",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          "&::before": {
                            backgroundColor: "error.main",
                            borderRadius: "50%",
                            content: '""',
                            display: "block",
                            height: 8,
                            left: 4,
                            position: "absolute",
                            top: 7,
                            width: 8,
                            zIndex: 1,
                          },
                        }}
                      >
                        <Typography
                          color="error"
                          sx={{ ml: 3 }}
                          variant="body2"
                        >
                          Off
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ mt: 1 }} variant="subtitle2">
                      Authenticator App
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{ mt: 1 }}
                      variant="body2"
                    >
                      Use an authenticator app to generate one time security
                      codes.
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                      <Button
                        endIcon={<ArrowRightIcon fontSize="small" />}
                        variant="outlined"
                      >
                        Set Up
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Card sx={{ height: "100%" }} variant="outlined">
                  <CardContent>
                    <Box sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          "&::before": {
                            backgroundColor: "error.main",
                            borderRadius: "50%",
                            content: '""',
                            display: "block",
                            height: 8,
                            left: 4,
                            position: "absolute",
                            top: 7,
                            width: 8,
                            zIndex: 1,
                          },
                        }}
                      >
                        <Typography
                          color="error"
                          sx={{ ml: 3 }}
                          variant="body2"
                        >
                          Off
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ mt: 1 }} variant="subtitle2">
                      Text Message
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{ mt: 1 }}
                      variant="body2"
                    >
                      Use your mobile phone to receive security codes via SMS.
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                      <Button
                        endIcon={<ArrowRightIcon fontSize="small" />}
                        variant="outlined"
                      >
                        Set Up
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6">Login history</Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
            Your recent login activity:
          </Typography>
        </CardContent>
        <Scrollbar>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Login type</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Client</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Credentials login</Typography>
                  <Typography variant="body2" color="body2">
                    on 10:40 AM 2021/09/01
                  </Typography>
                </TableCell>
                <TableCell>95.130.17.84</TableCell>
                <TableCell>Chrome, Mac OS 10.15.7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Credentials login</Typography>
                  <Typography color="body2" variant="body2">
                    on 10:40 AM 2021/09/01
                  </Typography>
                </TableCell>
                <TableCell>95.130.17.84</TableCell>
                <TableCell>Chrome, Mac OS 10.15.7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Scrollbar>
      </Card> */}
    </>
  );
};
