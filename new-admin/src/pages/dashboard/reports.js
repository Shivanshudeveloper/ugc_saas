import { useEffect, useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  DialogActions,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import DeleteIcon from "@mui/icons-material/Delete";
import { RemoveRedEye, FactCheck, Download as DownloadIcon } from "@mui/icons-material";

import { Cog as CogIcon } from "../../icons/cog";
import { gtm } from "../../lib/gtm";
import { useRouter } from "next/router";
import { API_SERVICE } from "../../config";
import { useAuth } from "../../hooks/use-auth";

import {
  CardMedia,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "../../icons/arrow-left";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ImageIcon from "@mui/icons-material/Image";
import RectangleIcon from "@mui/icons-material/RectangleOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccessTime from "@mui/icons-material/AccessTime";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import BrandDialog from "src/components/dashboard/users/brand-dialog";
import CreatorDialog from "src/components/dashboard/users/creator-dialog";
import OrderList from "src/components/dashboard/order/admin-order";

import * as React from "react";
import Switch from "@mui/material/Switch";

const CustomBox = ({ value, title }) => (
  <Grid
    item
    md={3}
    xs={12}
    sx={{
      alignItems: "center",
      borderRight: (theme) => ({
        md: `1px solid ${theme.palette.divider}`,
      }),
      borderBottom: (theme) => ({
        md: "none",
        xs: `1px solid ${theme.palette.divider}`,
      }),
      display: "flex",
      justifyContent: "space-between",
      p: 3,
    }}
  >
    <div>
      <Typography variant="h5">{value}</Typography>
      <Typography color="textSecondary" variant="overline">
        {title}
      </Typography>
    </div>
  </Grid>
);

const Creators = () => {
  const router = useRouter();
  // const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [creators, setCreators] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [orders, setOrders] = useState([]);

  const [creatorOpen, setcreatorOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);

  const [brandOpen, setbrandOpen] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const [orderOpen, setorderOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["userId", "userType", "name", "email"]);
  const [loading, setLoading] = useState(true);

  const fetchCreators = async () => {
    try {
      const response = await fetch(`${API_SERVICE}/get_all_creators`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setCreators(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllCampaigns = async () => {
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

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_SERVICE}/get_all_users`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setUsers(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_SERVICE}/get_orders`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setOrders(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editUserStatus = async (userId) => {
    try {
      const response = await fetch(`${API_SERVICE}/edit_user/${userId}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disabled: !users.find((user) => user.userId === userId).disabled,
        }),
      });
      console.log(response.status);
      if (response.status === 200) {
        // const data = await response.json();
        // console.log(data);
        // const updatedUser = users.find((user) => user.userId === userId);
        // updatedUser.disabled = !updatedUser.disabled;
        // const filteredUsers = users.filter((user) => user.userId !== userId);
        // setUsers([...filteredUsers, updatedUser]);
        fetchUsers();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const totalTransactions = () => {
    let sum = 0;
    users?.forEach((user) => {
      sum += parseInt(user?.funds?.amount);
    });
    console.log("Sum");
    console.log(sum);
    return sum;
  };

  const findTotalOrders = (user) => {
    if (user?.userType === "brand") {
      return orders.filter((order) => order?.branduser === user?.userId).length;
    }
    return orders.filter((order) => order?.creatoruser === user?.userId).length;
  };

  const findTotalCampaigns = (user) => {
    if (user?.userType === "creator") return 0;
    return campaigns.filter((campaign) => campaign?.userId === user?.userId).length;
  };

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUsers();
    fetchCreators();
    fetchAllCampaigns();
    fetchOrders();
    setLoading(false);
  }, []);

  function search(items) {
    return items?.filter((item) => {
      return searchParam.some((newItem) => {
        // console.log(item);
        // console.log(newItem);
        return item[newItem]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
      });
    });
  }

  const handleSearch = (e) => {
    // console.log(e.target.value);
    setQ(e.target.value);
  };

  return (
    <>
      <BrandDialog
        brandOpen={brandOpen}
        setbrandOpen={setbrandOpen}
        campaigns={selectedCampaigns}
      />
      <CreatorDialog
        creatorOpen={creatorOpen}
        setcreatorOpen={setcreatorOpen}
        selectedCreator={selectedCreator}
      />
      <Dialog onClose={() => setorderOpen(false)} open={orderOpen} maxWidth="lg">
        <DialogContent>
          <OrderList orders={selectedOrders}></OrderList>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setorderOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Head>
            <title>Dashboard: Finance | Cyber Click</title>
          </Head>
          <Container>
            <Box sx={{ mt: 4 }}>
              <Card>
                <CardContent>
                  <Grid container>
                    <CustomBox
                      value={`$${totalTransactions().toFixed(2)}`}
                      title="Total Transactions"
                    ></CustomBox>
                    <CustomBox value={users.length} title="Total Users"></CustomBox>
                    <CustomBox
                      value={users.filter((user) => user.userType === "brand").length}
                      title="Total Brands"
                    ></CustomBox>
                    <CustomBox
                      value={users.filter((user) => user.userType === "creator").length}
                      title="Total Creators"
                    ></CustomBox>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Container>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 6,
            }}
          >
            <Container maxWidth="xl">
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4">Report</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    sx={{ mx: 2 }}
                    variant="outlined"
                    size="small"
                    label="Search"
                    value={q}
                    onChange={handleSearch}
                  />
                  <Button
                    // style={{ backgroundColor: "#607464" }}
                    component="a"
                    startIcon={<DownloadIcon fontSize="small" />}
                    variant="contained"
                  >
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button"
                      table="table-to-xls-users"
                      filename="cybrclick-admin-users"
                      sheet="cybrclick-admin-users"
                      buttonText="Download as XLS"
                    // backgroundColor="#5F7464"
                    ></ReactHTMLTableToExcel>
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" id="table-to-xls-users">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Sr No.</TableCell>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Contact</TableCell>
                      <TableCell align="center">Email</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">Funds</TableCell>
                      <TableCell align="center">Total Orders</TableCell>
                      <TableCell align="center">Total Campaigns</TableCell>
                      <TableCell align="center">Active</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {search(users)?.map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{user?.name || "-"}</TableCell>
                        <TableCell align="center">{user?.phoneNumber || "-"}</TableCell>
                        <TableCell align="center">{user?.email || "-"}</TableCell>
                        <TableCell align="center">{user?.userType}</TableCell>

                        <TableCell align="center">{`$${parseInt(user?.funds?.amount).toFixed(
                          2
                        )}`}</TableCell>
                        <TableCell align="center">{findTotalOrders(user)}</TableCell>
                        <TableCell align="center">{findTotalCampaigns(user)}</TableCell>
                        <TableCell align="center">{user.disabled ? "No" : "Yes"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

Creators.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Creators;
