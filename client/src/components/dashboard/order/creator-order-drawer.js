import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { format } from "date-fns";
import numeral from "numeral";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { X as XIcon } from "../../../icons/x";
import { PropertyList } from "../../property-list";
import { PropertyListItem } from "../../property-list-item";
import { Scrollbar } from "../../scrollbar";

import VideocamIcon from "@mui/icons-material/Videocam";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";

import ImageIcon from "@mui/icons-material/Image";
import RectangleIcon from "@mui/icons-material/RectangleOutlined";

import { API_SERVICE } from "../../../config";
import { storage } from "../../../lib/firebase";
import { v4 as uuid } from "uuid";

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
import { useMounted } from "../../../hooks/use-mounted";
import { FileDropzone } from "../../file-dropzone";

function toDoublePrice(price) {
  if (price) {
    price = parseFloat(price);
    return price;
  }
  return 0;
}

const OrderPreview = (props) => {
  const { lgUp, order, fetchAgain, onClose } = props;
  const contentType = order?.campaign?.content?.contentType;
  const isMounted = useMounted();
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(
    contentType === 0 ? order?.demoImage : order?.demoVideo
  );
  const [extraCover, setExtraCover] = useState(
    contentType === 0 ? order?.demoExtraImage : order?.demoExtraVideo
  );

  const uploadFile = async (file) => {
    try {
      let body = {
        status: 2,
      };
      if (contentType === 0) {
        body.demoImage = file;
      } else {
        body.demoVideo = file;
      }
      console.log(body)
      const response = await fetch(`${API_SERVICE}/edit_order/${order?._id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        // const data = await response.json();
        // console.log(data);
        onClose();
        fetchAgain();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadExtraFile = async (file) => {
    try {
      let body = {
        status: 2,
      };
      if (contentType === 0) {
        body.demoExtraImage = file;
      } else {
        body.demoExtraVideo = file;
      }
      console.log(body)
      const response = await fetch(`${API_SERVICE}/edit_order/${order?._id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        // const data = await response.json();
        // console.log(data);
        onClose();
        fetchAgain();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleReview = useCallback(async () => {
    try {
      const response = await fetch(`${API_SERVICE}/edit_order/${order?._id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: 5,
        }),
      });
      if (response.status === 200) {
        // const data = await response.json();
        // console.log(data);
        onClose();
        fetchAgain();
      }
    } catch (err) {
      console.log(err);
    }
  }, [isMounted]);

  console.log(cover);

  const handleDropCover = async ([file]) => {
    console.log(file);
    uploadVideo(file);
  };

  const handleDropExtraCover = async ([file]) => {
    console.log(file);
    uploadExtra(file);
  };

  const uploadVideo = (file) => {
    console.log(file);
    if (file === null) return;
    setLoading(true);
    console.log(cover);

    if (cover) {
      const desertRef = storage.refFromURL(cover);
      desertRef
        .delete()
        .then(function () {
          // File deleted successfully
          console.log("Deleted");
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
          console.log(error);
        });
    }

    const name = uuid();
    storage
      .ref(`ugcsass/order-files/${name}`)
      .put(file)
      .on("state_changed", alert("uploading"), alert, () => {
        storage
          .ref("ugcsass")
          .child("order-files")
          .child(name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setCover(url);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      });
    console.log("Here");
  };

  const uploadExtra = (file) => {
    console.log(file);
    if (file === null) return;
    setLoading(true);
    console.log(extraCover);

    if (extraCover) {
      const desertRef = storage.refFromURL(extraCover);
      desertRef
        .delete()
        .then(function () {
          // File deleted successfully
          console.log("Deleted");
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
          console.log(error);
        });
    }

    const name = uuid();
    storage
      .ref(`ugcsass/order-files/${name}`)
      .put(file)
      .on("state_changed", alert("uploading"), alert, () => {
        storage
          .ref("ugcsass")
          .child("order-files")
          .child(name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setExtraCover(url);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      });
    console.log("Here");
  };

  console.log(order?.campaign?.product?.price);
  let productPrice = toDoublePrice(order?.campaign?.product?.price);
  let contentPrice = findContentPrice(
    order?.campaign?.content?.contentType,
    order?.campaign?.content?.imageContent?.price,
    order?.campaign?.content?.videoContent?.price
  );
  let videoDurationPrice =
    order?.campaign?.content?.contentType === 1
      ? toDoublePrice(order?.campaign?.content?.videoDuration?.price)
      : 0;
  let shipping = toDoublePrice(order?.campaign?.shipping);
  let tax = toDoublePrice(order?.campaign?.tax);
  let creatorPrice = toDoublePrice(
    order?.campaign?.content?.creatorLevel?.price
  );
  let costPerJob =
    productPrice +
    contentPrice +
    shipping +
    tax +
    videoDurationPrice +
    creatorPrice;
  let subTotalCost = costPerJob * order?.campaign?.content?.noOfCreators;
  let platFormFee = subTotalCost * 0.04;
  let totalBudget = subTotalCost + platFormFee;

  const align = lgUp ? "horizontal" : "vertical";


  return (
    <>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Campaign Name: {order?.campaign?.campaignName}
      </Typography>

      {order?.review && (
        <Typography variant="h5" sx={{ mb: 4 }}>
          Review: {order?.review}
        </Typography>
      )}

      {loading ? (
        <>Loading...</>
      ) : contentType === 0 ? (
        <center>
          <img
            style={{ width: "320px", marginTop: "5px" }}
            src={cover}
            alt="Image"
          />
        </center>
      ) : (
        <center>
          <video
            width="320"
            height="180"
            style={{ marginTop: "5px" }}
            src={cover}
            alt="Video"
            controls
          />
        </center>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2,
        }}
      >
        <Button
          variant="contained"
          align="center"
          onClick={() => uploadFile(cover)}
        >
          Submit
        </Button>
      </Box>

      {loading ? (
        <>Loading...</>
      ) : contentType === 0 ? (
        <center>
          <img
            style={{ width: "320px", marginTop: "5px" }}
            src={extraCover}
            alt="Image"
          />
        </center>
      ) : (
        <center>
          <video
            width="320"
            height="180"
            style={{ marginTop: "5px" }}
            src={extraCover}
            alt="Video"
            controls
          />
        </center>
      )}


      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2,
        }}
      >
        <Button
          variant="contained"
          align="center"
          onClick={() => uploadExtraFile(extraCover)}
        >
          Submit Extra Content
        </Button>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          {`Upload ${order?.campaign?.content?.contentType === 0 ? "Image" : "Video"
            }`}
        </Typography>
        <FileDropzone
          accept={contentType === 0 ? "image/*" : "video/*"}
          maxFiles={1}
          onDrop={handleDropCover}
        />
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          {/* {`Upload ${order?.campaign?.content?.contentType === 0 ? "Image" : "Video"
            }`} */}
          Upload Extra content

        </Typography>
        <FileDropzone
          accept={contentType === 0 ? "image/*" : "video/*"}
          maxFiles={1}
          onDrop={handleDropExtraCover}
        />
      </Box>

      {/* <Typography sx={{ my: 3 }} variant="h6">
        Details
      </Typography> */}
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
            {order?.campaign?.content?.contentType === 0 ? (
              <ImageIcon sx={{ mr: 1 }} />
            ) : (
              <VideocamIcon sx={{ mr: 1 }} />
            )}

            <div style={{ fontSize: "16px", marginRight: "20px" }}>
              {order?.campaign?.content?.contentType === 0
                ? order?.campaign?.content?.imageContent?.title
                : order?.campaign?.content?.videoContent?.title}
            </div>
            <RectangleIcon sx={{ mr: 1 }} />
            <div style={{ fontSize: "16px" }}>
              {order?.campaign?.content?.contentFormat?.title}
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
            <div style={{ color: "gray", fontSize: "14px" }}>Description</div>

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
              {order?.campaign?.content?.contentDescription}
            </div>
          </div>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <div style={{ color: "gray", fontSize: "14px" }}>Cost</div>
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
        ${order?.campaign?.content?.contentType === 0 ? "Image" : "Video"}`}
            </div>
            <div style={{ fontSize: "14px" }}>${contentPrice.toFixed(2)}</div>
          </div>
          {order?.campaign?.content?.contentType === 1 && (
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
            <div style={{ fontSize: "14px" }}>${productPrice.toFixed(2)}</div>
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
            <div style={{ fontSize: "14px" }}>Creator level price</div>
            <div style={{ fontSize: "14px" }}>${creatorPrice.toFixed(2)}</div>
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
            <div style={{ fontSize: "14px" }}>${shipping.toFixed(2)}</div>
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
            <div style={{ fontSize: "14px" }}> ${tax.toFixed(2)}</div>
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
            <div style={{ fontSize: "14px" }}>Subtotal cost per campaign</div>
            <div style={{ fontSize: "14px" }}>${subTotalCost.toFixed(2)}</div>
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
          <div align="right" style={{ fontSize: "14px", fontWeight: "bold" }}>
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
      {/* <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="Name"
          value="Leather Bag"
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="For"
          value="Video Recording"
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="ID"
          value={order.id}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="Number"
          value={order.number}
        />
        />
      </PropertyList> */}
      {/* <Divider sx={{ my: 3 }} />
      <Typography sx={{ my: 3 }} variant="h6">
        Line items
      </Typography>
      <Scrollbar>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Billing Cycle</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.name} x {item.quantity}
                </TableCell>
                <TableCell>{item.billingCycle}</TableCell>
                <TableCell>
                  {numeral(item.unitAmount).format(`${item.currency}0,0.00`)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar> */}
    </>
  );
};

// <Box sx={{ mt: 2 }}>
//   <Container
//     maxWidth="md"
//     // style={{ margin: "0 20px", padding: "0 50px" }}
//   >
//     <Typography variant="h5" sx={{ mt: 2 }}>
//       Campaign Name: {order?.campaign?.campaignName}
//     </Typography>

//     <Card sx={{ mt: 2 }}>
//       <CardContent>
//         <Grid
//           container
//           spacing={2}
//           xs={{
//             display: "flex",
//             justifyContent: "flex-start",
//             alignItems: "center",
//             flexDirection: "row",
//           }}
//         >
//           <Grid item xs={12}>
//             <Typography variant="h6">Product Information</Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Box
//               sx={{
//                 backgroundImage: `url(${order?.campaign?.product?.cover})`,
//                 backgroundPosition: "top left",
//                 // backgroundSize: "cover",
//                 borderRadius: 1,
//                 height: 100,
//                 backgroundSize: "contain",
//                 backgroundRepeat: "no-repeat",
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <div style={{ fontWeight: "bold", fontSize: "16px" }}>Test</div>
//             <div style={{ display: "flex" }}>
//               <div style={{ marginRight: "20px", fontSize: "16px" }}>
//                 ${productPrice.toFixed(2)}
//               </div>
//               <div style={{ fontSize: "16px", color: "#0000EE" }}>
//                 Product Link
//               </div>
//             </div>
//             <div
//               style={{
//                 marginTop: "20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//               }}
//             >
//               {order?.campaign?.selectedPayment === "reimbursement"
//                 ? "Reimbursement"
//                 : "Delivered By Me"}
//             </div>
//             <div
//               style={{
//                 fontSize: "14px",
//                 color: "gray",
//               }}
//             >
//               {order?.campaign?.selectedPayment === "reimbursement"
//                 ? "Creators buy the product you refund the cost"
//                 : "No extra shipping cost/taxes"}
//             </div>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   </Container>
//   <Container
//     maxWidth="md"
//     // style={{ margin: "0 20px", padding: "0 50px" }}
//   >
//     <Card sx={{ mt: 4 }}>
//       <CardContent></CardContent>
//     </Card>
//   </Container>
// </Box>;

const OrderDrawerDesktop = styled(Drawer)({
  width: 500,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    position: "relative",
    width: 500,
  },
});

const OrderDrawerMobile = styled(Drawer)({
  flexShrink: 0,
  maxWidth: "100%",
  height: "calc(100% - 64px)",
  width: 500,
  "& .MuiDrawer-paper": {
    height: "calc(100% - 64px)",
    maxWidth: "100%",
    top: 64,
    width: 500,
  },
});

export const OrderDrawer = (props) => {
  const { containerRef, fetchAgain, onClose, open, order, ...other } = props;

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  // The reason for doing this, is that the persistent drawer has to be rendered, but not it's
  // content if an order is not passed.
  const content = order ? (
    <>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography color="inherit" variant="h6">
          {order.number}
        </Typography>
        <IconButton color="inherit" onClick={onClose}>
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 4,
        }}
      >
        <OrderPreview
          order={order}
          lgUp={lgUp}
          onClose={onClose}
          fetchAgain={fetchAgain}
        />
      </Box>
    </>
  ) : null;

  if (lgUp) {
    return (
      <OrderDrawerDesktop
        anchor="right"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </OrderDrawerDesktop>
    );
  }

  return (
    <OrderDrawerMobile
      anchor="right"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </OrderDrawerMobile>
  );
};

OrderDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  order: PropTypes.object,
};
