import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { customerApi } from "../../../__fake-api__/customer-api";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { CustomerListTable } from "../../../components/dashboard/customer/customer-list-table";
import { useMounted } from "../../../hooks/use-mounted";
import { Download as DownloadIcon } from "../../../icons/download";
import { Plus as PlusIcon } from "../../../icons/plus";
import { Search as SearchIcon } from "../../../icons/search";
import { Upload as UploadIcon } from "../../../icons/upload";
import { gtm } from "../../../lib/gtm";
import { useAuth } from "../../../hooks/use-auth";
import { API_SERVICE } from "../../../config";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NextLink from "next/link";

import { useDispatch } from "react-redux";
import { FETCH_CAMPAIGN_DATA } from "../../../store/actions";
import {
  imageContents,
  videoContents,
  videoDurationContents,
  creatorLevels,
  contentFormatContents,
} from "../../../content-data/data";

import { useRouter } from "next/router";

const tabs = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Paused",
    value: "paused",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Pending Approval",
    value: "isApproved",
  },
  {
    label: "Declined",
    value: "declined",
  },
];

const CustomerList = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [campaigns, setCampaigns] = useState([]);
  const [toggler, setToggler] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const dispatch = useDispatch();
  const router = useRouter();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_SERVICE}/get_campaigns/${user?.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        // console.log(response);
        const data = await response.json();
        setCampaigns(data);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      const response = await fetch(
        `${API_SERVICE}/delete_campaign/${campaignId}/${user?.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        setToggler(!toggler);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  console.log(campaigns);

  useEffect(() => {
    fetchCampaigns();
  }, [user?.id, toggler]);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>Dashboard: Customer List | Cyber Click</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          {loading ? (
            "Loading..."
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Grid container justifyContent="space-between" spacing={3}>
                  <Grid item>
                    <Typography variant="h4">My Campaigns</Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => {
                        router.push(`/dashboard/campaigns/create`);
                      }}
                      startIcon={<PlusIcon fontSize="small" />}
                      variant="contained"
                    >
                      Create Campaign
                    </Button>
                  </Grid>
                </Grid>

                {/* <Box
                  sx={{
                    m: -1,
                    mt: 3,
                  }}
                >
                  <Grid container>
                    <Grid
                      item
                      md={4}
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
                        <Typography variant="h5">
                          {
                            campaigns.filter(
                              (campaign) => campaign.content?.contentType === 1
                            ).length
                          }
                        </Typography>
                        <Typography color="textSecondary" variant="overline">
                          My Posts
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      item
                      md={4}
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
                        <Typography variant="h5">
                          {
                            campaigns.filter(
                              (campaign) => campaign.content?.contentType === 0
                            ).length
                          }
                        </Typography>
                        <Typography color="textSecondary" variant="overline">
                          My Images
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      item
                      md={4}
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
                        <Typography variant="h5">
                          {
                            campaigns.filter(
                              (campaign) => campaign.content?.contentType === 1
                            ).length
                          }
                        </Typography>
                        <Typography color="textSecondary" variant="overline">
                          My Videos
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Box> */}
              </Box>
              <Card>
                {/* <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ px: 3 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs> */}
                <Divider />
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    m: -1.5,
                    p: 3,
                  }}
                >
                  {currentTab === "all" && (
                    <TableContainer sx={{ my: 3, mx: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">S. No</TableCell>
                            <TableCell align="center">Brand</TableCell>
                            <TableCell align="center">Campaign Name</TableCell>
                            <TableCell align="center">Content Type</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {campaigns.map((row, i) => {
                            return (
                              <TableRow
                                hover
                                key={row._id}
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell align="center">{i + 1}</TableCell>
                                <TableCell align="center">
                                  {row?.brand?.name}
                                </TableCell>
                                <TableCell align="center">
                                  {row?.campaignName}
                                </TableCell>
                                <TableCell align="center">
                                  {row?.content?.contentType === 0
                                    ? "Image"
                                    : "Video"}
                                </TableCell>

                                <TableCell align="center">
                                  <Tooltip title="View">
                                    <IconButton
                                      onClick={() => {
                                        console.log("Hello");
                                        router.push(
                                          `/dashboard/campaigns/${row._id}`
                                        );
                                      }}
                                      aria-label="upload picture"
                                      component="span"
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      color="primary"
                                      aria-label="upload picture"
                                      component="span"
                                      onClick={() => {
                                        console.log("Hello");
                                        let payload = {
                                          brand: row?.brand,
                                          campaignName: row?.campaignName,
                                          product: row?.product,
                                          content: row?.content,
                                          selectedPayment: row?.payment,
                                          shipping: row?.shipping,
                                          tax: row?.tax,
                                          gender: row?.gender,
                                        };
                                        console.log(payload);
                                        dispatch({
                                          type: FETCH_CAMPAIGN_DATA,
                                          payload: payload,
                                        });
                                        router.push(
                                          `/dashboard/campaigns/create?campaignId=${row._id}`
                                        );
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={() => {
                                        deleteCampaign(row._id);
                                      }}
                                      color="error"
                                      aria-label="upload picture"
                                      component="span"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  {currentTab === "active" && <div>Active</div>}
                  {currentTab === "paused" && <div>Paused</div>}
                  {currentTab === "completed" && <div>Completed</div>}
                  {currentTab === "isApproved" && <div>isApproved</div>}
                  {currentTab === "declined" && <div>Declined</div>}
                </Box>
              </Card>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

CustomerList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default CustomerList;
