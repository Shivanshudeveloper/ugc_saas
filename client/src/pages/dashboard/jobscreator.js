import { useContext, useEffect, useRef, useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
} from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { API_SERVICE } from "../../config";

import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { Cog as CogIcon } from "../../icons/cog";
import { gtm } from "../../lib/gtm";
import { Search as SearchIcon } from "../../icons/search";
import JobCard from "../../components/dashboard/jobscreator/job-card";
import { UserCircle } from "../../icons/user-circle";
import { useAuth } from "../../hooks/use-auth";

import { ArrowLeft as ArrowLeftIcon } from "../../icons/arrow-left";
import ImageIcon from "@mui/icons-material/Image";
import RectangleIcon from "@mui/icons-material/RectangleOutlined";
import CustomSnackbar from "../../components/custom-snackbar";

function findReimbursementPrice(...prices) {
  let sum = 0;
  for (const element of prices) {
    if (!element) continue;
    sum += parseFloat(element);
  }
  return sum;
}

function findContentPrice(contentType, imagePrice, videoPrice) {
  if (contentType === 0) {
    return imagePrice || 0;
  } else {
    return videoPrice || 0;
  }
}

function findTotalBudget(contentPrice, reimbursementPrice) {
  contentPrice = contentPrice ? parseFloat(contentPrice) : 0;
  return contentPrice + reimbursementPrice;
}

import { useRouter } from "next/router";
import AlertContext from "../../contexts/alert-context";

function toDoublePrice(price) {
  if (price) {
    price = parseFloat(price);
    return price;
  }
  return 0;
}

const sortOptions = [
  {
    label: "Newest",
    value: "desc",
  },
  {
    label: "Oldest",
    value: "asc",
  },
];

const Finance = () => {
  //Snackbar
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState("");

  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [creatorLevel, setCreatorLevel] = useState(null);
  const [price, setPrice] = useState(null);
  const [sort, setSort] = useState("desc");
  const [filters, setFilters] = useState({
    query: "",
    status: undefined,
  });
  const queryRef = useRef(null);
  const initial = useContext(AlertContext);

  let productPrice = toDoublePrice(selectedCampaign?.product?.price);
  let contentPrice = findContentPrice(
    selectedCampaign?.content?.contentType,
    selectedCampaign?.content?.imageContent?.price,
    selectedCampaign?.content?.videoContent?.price
  );
  let videoDurationPrice =
    selectedCampaign?.content?.contentType === 1
      ? toDoublePrice(selectedCampaign?.content?.videoDuration?.price)
      : 0;
  let shipping = toDoublePrice(selectedCampaign?.shipping);
  let tax = toDoublePrice(selectedCampaign?.tax);
  let creatorPrice = toDoublePrice(
    selectedCampaign?.content?.creatorLevel?.price
  );
  let costPerJob =
    productPrice +
    contentPrice +
    shipping +
    tax +
    videoDurationPrice +
    creatorPrice;
  let subTotalCost = costPerJob * selectedCampaign?.content?.noOfCreators;
  let platFormFee = subTotalCost * 0.04;
  let totalBudget = subTotalCost + platFormFee;

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const handleQueryChange = (event) => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value,
    }));
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSort(value);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (parseInt(price) < totalBudget) {
      setMessage("Bid amount should be greater than campaign budget!");
      setSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {
      const response = await fetch(`${API_SERVICE}/add_bid`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign: selectedCampaign._id,
          creator: user?.creator?._id,
          // creatorLevel,
          price,
        }),
      });
      if (response.status === 200) {
        handleDialogClose();
        initial.setSnacky({
          color: "success",
          message: "Bidding Done",
          open: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_SERVICE}/get_all_campaigns`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        // console.log(response);
        const data = await response.json();
        console.log(data);
        setCampaigns(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <>
      <Dialog maxWidth="md" onClose={handleDialogClose} open={open}>
        {/* <DialogTitle>Add your bid</DialogTitle> */}
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Container
              maxWidth="md"
            // style={{ margin: "0 20px", padding: "0 50px" }}
            >
              <Typography variant="h5" sx={{ mt: 2 }}>
                Campaign Name: {selectedCampaign?.campaignName}
              </Typography>

              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    xs={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6">Product Information</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          backgroundImage: `url(${selectedCampaign?.product?.cover})`,
                          backgroundPosition: "top left",
                          // backgroundSize: "cover",
                          borderRadius: 1,
                          height: 100,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                        Test
                      </div>
                      <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "20px", fontSize: "16px" }}>
                          ${productPrice.toFixed(2)}
                        </div>
                        <div style={{ fontSize: "16px", color: "#0000EE" }}>
                          Product Link
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "20px",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedCampaign?.selectedPayment === "reimbursement"
                          ? "Reimbursement"
                          : "Delivered By Me"}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "gray",
                        }}
                      >
                        {selectedCampaign?.selectedPayment === "reimbursement"
                          ? "Creators buy the product you refund the cost"
                          : "No extra shipping cost/taxes"}
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Container>
            <Container
              maxWidth="md"
            // style={{ margin: "0 20px", padding: "0 50px" }}
            >
              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <Grid
                    container
                    spacing={3}
                    xs={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6">Content and Creators</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ color: "gray", fontSize: "14px" }}>
                          Content type and format
                        </div>

                        {/* <div
                          style={{ color: "blue", fontSize: "14px" }}
                          color="blue"
                        >
                          Edit
                        </div> */}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginTop: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        {selectedCampaign?.content?.contentType === 0 ? (
                          <ImageIcon sx={{ mr: 1 }} />
                        ) : (
                          <VideocamIcon sx={{ mr: 1 }} />
                        )}

                        <div style={{ fontSize: "16px", marginRight: "20px" }}>
                          {selectedCampaign?.content?.contentType === 0
                            ? selectedCampaign?.content?.imageContent?.title
                            : selectedCampaign?.content?.videoContent?.title}
                        </div>
                        <RectangleIcon sx={{ mr: 1 }} />
                        <div style={{ fontSize: "16px" }}>
                          {selectedCampaign?.content?.contentFormat?.title}
                        </div>
                      </div>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ color: "gray", fontSize: "14px" }}>
                          Description
                        </div>

                        {/* <div
                          style={{ color: "blue", fontSize: "14px" }}
                          color="blue"
                        >
                          Edit
                        </div> */}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginTop: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ fontSize: "16px", marginRight: "20px" }}>
                          {selectedCampaign?.content?.contentDescription}
                        </div>
                      </div>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <div style={{ color: "gray", fontSize: "14px" }}>
                        Cost
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>
                          {`Price per
                    ${selectedCampaign?.content?.contentType === 0
                              ? "Image"
                              : "Video"
                            }`}
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          ${contentPrice.toFixed(2)}
                        </div>
                      </div>
                      {selectedCampaign?.content?.contentType === 1 && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            marginTop: "10px",
                          }}
                        >
                          <div style={{ fontSize: "14px" }}>
                            Price for added video duration
                          </div>
                          <div style={{ fontSize: "14px" }}>
                            ${videoDurationPrice.toFixed(2)}
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>Product price</div>
                        <div style={{ fontSize: "14px" }}>
                          ${productPrice.toFixed(2)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>
                          Creator level price
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          ${creatorPrice.toFixed(2)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>Shipping</div>
                        <div style={{ fontSize: "14px" }}>
                          ${shipping.toFixed(2)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>Taxes</div>
                        <div style={{ fontSize: "14px" }}>
                          {" "}
                          ${tax.toFixed(2)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                          Cost per job
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                          ${costPerJob.toFixed(2)}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>
                          Subtotal cost per campaign
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          ${subTotalCost.toFixed(2)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                          Platform Fee
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                          ${platFormFee.toFixed(2)}
                        </div>
                      </div>
                      <div
                        align="right"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        =
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: "10px",
                        }}
                      >
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          Expected total budget(entire campaign)
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                          ${totalBudget.toFixed(2)}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Container>

            <Container
              maxWidth="md"
            // style={{ margin: "0 20px", padding: "0 50px" }}
            >
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    xs={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                        Enter Bid Details
                      </Typography>
                    </Grid>
                    {/* <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Creator Level
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="creatorLevel"
                          value={creatorLevel}
                          label="Pro Level"
                          onChange={(event) =>
                            setCreatorLevel(event.target.value)
                          }
                        >
                          <MenuItem value="level1">Level 1</MenuItem>
                          <MenuItem value="level2">Level 2</MenuItem>
                          <MenuItem value="level3">Level 3</MenuItem>
                          <MenuItem value="level4">Pro Level</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid> */}

                    <Grid item xs={12}>
                      <TextField
                        type={Number}
                        name="price"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        fullWidth
                        label="Price"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Container>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Head>
        <title>Jobs</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Jobs</Typography>
              </Grid>
              <Grid item></Grid>
              <Grid
                item
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  m: -1,
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleQueryChange}
                  sx={{
                    flexGrow: 1,

                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    defaultValue=""
                    fullWidth
                    inputProps={{ ref: queryRef }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Search by order number"
                  />
                  <Button
                    startIcon={<CogIcon fontSize="small" />}
                    sx={{ mx: 2 }}
                    variant="outlined"
                  >
                    Filters
                  </Button>
                  {/* <TextField
                    label="Sort By"
                    name="order"
                    onChange={handleSortChange}
                    select
                    SelectProps={{ native: true }}
                    value={sort}
                    sx={{ mx: 2 }}
                  /> */}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={3}>
            {campaigns.map((campaign) => {
              return (
                campaign?.takenBy === null &&
                < Grid item xs={12} md={4} key={campaign._id} >
                  <JobCard
                    campaign={campaign}
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      handleDialogOpen();
                    }}
                  />
                </Grid>
              )
            })}
          </Grid>
        </Container>

        <CustomSnackbar
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
          message={message}
          severity={severity}
        />
      </Box>
    </>
  );
};

Finance.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Finance;
