// import { useRouter } from "next/router";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import {
//   Alert,
//   Box,
//   Button,
//   Divider,
//   FormHelperText,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useAuth } from "../../hooks/use-auth";
// import { useMounted } from "../../hooks/use-mounted";

// export const FirebaseLogin = (props) => {
//   const isMounted = useMounted();
//   const router = useRouter();
//   const { signInWithEmailAndPassword, signInWithGoogle } = useAuth();
//   const formik = useFormik({
//     initialValues: {
//       email: "demo@devias.io",
//       password: "Password123!",
//       submit: null,
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Must be a valid email")
//         .max(255)
//         .required("Email is required"),
//       password: Yup.string().max(255).required("Password is required"),
//     }),
//     onSubmit: async (values, helpers) => {
//       try {
//         await signInWithEmailAndPassword(values.email, values.password);

//         if (isMounted()) {
//           const returnUrl = "/dashboard";
//           router.push(returnUrl);
//         }
//       } catch (err) {
//         console.error(err);

//         if (isMounted()) {
//           helpers.setStatus({ success: false });
//           helpers.setErrors({ submit: err.message });
//           helpers.setSubmitting(false);
//         }
//       }
//     },
//   });

//   const handleGoogleClick = async () => {
//     try {
//       await signInWithGoogle();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div {...props}>
//       <Button
//         fullWidth
//         onClick={handleGoogleClick}
//         size="large"
//         sx={{
//           backgroundColor: "common.white",
//           color: "common.black",
//           "&:hover": {
//             backgroundColor: "common.white",
//             color: "common.black",
//           },
//         }}
//         variant="contained"
//       >
//         <Box
//           alt="Google"
//           component="img"
//           src="/static/icons/google.svg"
//           sx={{ mr: 1 }}
//         />
//         Google
//       </Button>
//       <Box
//         sx={{
//           alignItems: "center",
//           display: "flex",
//           mt: 2,
//         }}
//       >
//         <Box sx={{ flexGrow: 1 }}>
//           <Divider orientation="horizontal" />
//         </Box>
//         <Typography color="textSecondary" sx={{ m: 2 }} variant="body1">
//           OR
//         </Typography>
//         <Box sx={{ flexGrow: 1 }}>
//           <Divider orientation="horizontal" />
//         </Box>
//       </Box>
//       <form noValidate onSubmit={formik.handleSubmit}>
//         <TextField
//           error={Boolean(formik.touched.email && formik.errors.email)}
//           fullWidth
//           helperText={formik.touched.email && formik.errors.email}
//           label="Email Address"
//           margin="normal"
//           name="email"
//           onBlur={formik.handleBlur}
//           onChange={formik.handleChange}
//           type="email"
//           value={formik.values.email}
//         />
//         <TextField
//           error={Boolean(formik.touched.password && formik.errors.password)}
//           fullWidth
//           helperText={formik.touched.password && formik.errors.password}
//           label="Password"
//           margin="normal"
//           name="password"
//           onBlur={formik.handleBlur}
//           onChange={formik.handleChange}
//           type="password"
//           value={formik.values.password}
//         />
//         {formik.errors.submit && (
//           <Box sx={{ mt: 3 }}>
//             <FormHelperText error>{formik.errors.submit}</FormHelperText>
//           </Box>
//         )}
//         <Box sx={{ mt: 2 }}>
//           <Button
//             disabled={formik.isSubmitting}
//             fullWidth
//             size="large"
//             type="submit"
//             variant="contained"
//           >
//             Log In
//           </Button>
//         </Box>
//         <Box sx={{ mt: 2 }}>
//           <Alert severity="info">
//             <div>
//               You can use <b>demo@devias.io</b> and password <b>Password123!</b>
//             </div>
//           </Alert>
//         </Box>
//       </form>
//     </div>
//   );
// };

import { useRouter } from "next/router";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import toast from "react-hot-toast";

import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useMounted } from "../../hooks/use-mounted";
import firebase from "../../lib/firebase";
import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export const FirebaseLogin = (props) => {
  const isMounted = useMounted();
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!auth.user) return;
    if (auth?.user?.userData?.disabled) {
      router.push("/account-disabled");
    }
    // else if (user?.userData?.disabled) {
    //   router.push("/account-disabled");
    // }
    else {
      if (auth?.user?.userData?.userType == "creator") {
        // setOpen(true);
        router.push("/dashboard/orders");
      } else {
        // router.push("/dashboard/orders");
        router.push("/dashboard");
      }
    }
  }, [auth?.isAuthenticated]);
  const router = useRouter();
  const { signInWithEmailAndPassword, signInWithGoogle } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // signInWithEmailAndPassword(values.email, values.password)

        firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(auth.user);
            if (
              auth.user &&
              auth?.user?.userData?.userType == "creator" &&
              auth?.user?.userData?.email == user.email
            ) {
              // setOpen(true);
              router.push("/dashboard/orders");
            }
            if (
              auth.user &&
              auth?.user?.userData?.userType == "brand" &&
              auth?.user?.userData?.email == user.email
            ) {
              router.push("/dashboard/orders");
            }
            // else {
            //   router.push("/dashboard/orders");
            // }
            // const returnUrl = router.query.returnUrl || "/dashboard";
            // router.push(returnUrl);

            sessionStorage.setItem("userId", user.uid);
            sessionStorage.setItem("userEmail", user.email);
          })
          .catch((err) => {
            console.log(err);
            if (err?.code === "auth/user-not-found") {
              toast.error("User not found");
            }
            if (err?.code === "auth/wrong-password") {
              toast.error("Wrong password");
            }
            if (err?.code === "auth/too-many-requests") {
              toast.error(err?.message);
            }
          });

        // if (isMounted()) {
        //   returnUrl = router.query.returnUrl || "/dashboard";
        //   router.push(returnUrl);
        // }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  const handleGoogleClick = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();

      return firebase.auth().signInWithPopup(provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div {...props}>
      {/* <Button
        fullWidth
        onClick={handleGoogleClick}
        size="large"
        sx={{
          backgroundColor: "common.white",
          color: "common.black",
          "&:hover": {
            backgroundColor: "common.white",
            color: "common.black",
          },
        }}
        variant="contained"
      >
        <Box
          alt="Google"
          component="img"
          src="/static/icons/google.svg"
          sx={{ mr: 1 }}
        />
        Google
      </Button> */}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <InfoIcon
            style={{
              marginLeft: "98px",
              fontSize: "50px",
              color: "#5048E5",
              fontWeight: 600,
            }}
          ></InfoIcon>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "#5048E5" }}
          >
            Account is under review by admin
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          mt: 2,
        }}
      >
        {/* <Box sx={{ flexGrow: 1 }}>
          <Divider orientation="horizontal" />
        </Box>
        <Typography color="textSecondary" sx={{ m: 2 }} variant="body1">
          OR
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Divider orientation="horizontal" />
        </Box> */}
      </Box>
      <form noValidate onSubmit={formik.handleSubmit}>
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email Address"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
        />
        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="Password"
          margin="normal"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
        />
        {formik.errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Button
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Log In
          </Button>
        </Box>
        {/* <Box sx={{ mt: 2 }}>
          <Alert severity="info">
            <div>
              You can use
              {' '}
              <b>demo@devias.io</b>
              {' '}
              and password
              {' '}
              <b>Password123!</b>
            </div>
          </Alert>
        </Box> */}
      </form>
    </div>
  );
};
