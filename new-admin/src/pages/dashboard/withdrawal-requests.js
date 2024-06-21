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
  IconButton,
} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";

import DeleteIcon from "@mui/icons-material/Delete";
import { RemoveRedEye, FactCheck, Delete } from "@mui/icons-material";

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
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);

  const [creatorOpen, setcreatorOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);

  const [brandOpen, setbrandOpen] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const [orderOpen, setorderOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["userId", "amount", "currency", "email"]);

  const [loading, setLoading] = useState(true);

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
        // console.log(data);
        setUsers(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllWithdrawalRequests = async () => {
    try {
      const response = await fetch(`${API_SERVICE}/get-all-withdrawals`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setWithdrawalRequests(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUsers();

    fetchAllWithdrawalRequests();
    setLoading(false);
  }, []);

  function search(items) {
    return items?.filter((item) => {
      return searchParam.some((newItem) => {
        return item[newItem]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
      });
    });
  }

  const handleSearch = (e) => {
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
        <CircularProgress size={20} align="center" />
      ) : (
        <>
          <Head>
            <title>Dashboard: Finance | Cyber Click</title>
          </Head>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 6,
            }}
          >
            <Container maxWidth="xl">
              <Box sx={{ mb: 4 }}>
                <Grid container justifyContent="space-between" spacing={3}>
                  <Grid item>
                    <Typography variant="h4">Requests</Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      m: -1,
                    }}
                  >
                    <TextField
                      sx={{ m: 1 }}
                      variant="outlined"
                      size="small"
                      label="Search"
                      value={q}
                      onChange={handleSearch}
                    />
                  </Grid>
                </Grid>
              </Box>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Sr No.</TableCell>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Contact</TableCell>
                      <TableCell align="center">Email</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">Amount</TableCell>

                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {search(withdrawalRequests)?.map((withdrawalRequest, index) => {
                      const user = users.find((user) => user.userId === withdrawalRequest.userId);
                      console.log('id ====', user?._id)
                      return (
                        <TableRow
                          key={user?._id}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{user?.name || "-"}</TableCell>
                          <TableCell align="center">{user?.phoneNumber || "-"}</TableCell>
                          <TableCell align="center">{user?.email || "-"}</TableCell>
                          <TableCell align="center">{user?.userType}</TableCell>

                          <TableCell align="center">{`$${parseFloat(
                            withdrawalRequest?.amount
                          ).toFixed(2)}`}</TableCell>

                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <IconButton
                                // sx={{ border: "1px solid #000" }}
                                onClick={async () => {
                                  //   console.log(user);
                                  //   deleteUser(user?.userId);
                                }}
                                //   color="error"
                                variant="outlined"
                                size="small"
                              // sx={{ mx: 2 }}
                              >
                                <RemoveRedEye />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
