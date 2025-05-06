import { useState } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import SplashScreen from "components/SplashScreen";

// Validation schemas
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.mixed().required("required"),
});
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

// Initial form values
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: null,
};
const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const [pageType, setPageType] = useState("login");
  const [showSplash, setShowSplash] = useState(false);
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const register = async (values, actions) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("picturePath", values.picture.name);
    const response = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (response.ok) setPageType("login");
    actions.setSubmitting(false);
    actions.resetForm();
  };

  const login = async (values, actions) => {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (response.ok) {
      dispatch(setLogin({ user: result.user, token: result.token }));
      setShowSplash(true);
      setTimeout(()=>{
        navigate("/home");
      },2500);
    }
    actions.setSubmitting(false);
    actions.resetForm();
  };

  if(showSplash)return <SplashScreen />;
  return (
    <Box
      sx={{
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      py: 6,
      px: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} md={12} lg={10}>
        <Typography
          variant="h5"
          fontWeight="500"
          align="center"
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
        Threadly: Stitching People Together, One Thread at a Time
        </Typography>

          <Grid
            container
            spacing={0}
            sx={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: 4,
              backgroundColor: theme.palette.background.paper,
              minHeight: 600,
              width: '100%',
            }}
          >
            {/* Left Panel */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ p: isNonMobile ? 8 : 6 }}
            >
              {isLogin ? (
                <>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Login to Your Account
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Login using social networks
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    <Button
                      fullWidth={!isNonMobile}
                      variant="contained"
                      startIcon={<FacebookIcon />}
                      sx={{ bgcolor: '#1877F2', '&:hover': { bgcolor: '#155DB2' }, minWidth: 120 }}
                    >Facebook</Button>
                    <Button
                      fullWidth={!isNonMobile}
                      variant="contained"
                      startIcon={<GoogleIcon />}
                      sx={{ bgcolor: '#DB4437', '&:hover': { bgcolor: '#B3362A' }, minWidth: 120 }}
                    >Google</Button>
                    <Button
                      fullWidth={!isNonMobile}
                      variant="contained"
                      startIcon={<LinkedInIcon />}
                      sx={{ bgcolor: '#0A66C2', '&:hover': { bgcolor: '#084C96' }, minWidth: 120 }}
                    >LinkedIn</Button>
                  </Box>
                  <Divider sx={{ mb: 4 }}>OR</Divider>
                </>
              ) : (
                <>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Create Your Account
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Join our community by filling out the form
                  </Typography>
                </>
              )}

              <Formik
                initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
                validationSchema={isLogin ? loginSchema : registerSchema}
                onSubmit={isLogin ? login : register}
              >
                {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <Box
                      display="grid"
                      gap="20px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{ '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' } }}
                    >
                      {isRegister && (
                        <>
                          <TextField label="First Name" name="firstName" onBlur={handleBlur} onChange={handleChange}
                            value={values.firstName} error={touched.firstName && Boolean(errors.firstName)} helperText={touched.firstName && errors.firstName}
                            sx={{ gridColumn: 'span 2' }}
                          />
                          <TextField label="Last Name" name="lastName" onBlur={handleBlur} onChange={handleChange}
                            value={values.lastName} error={touched.lastName && Boolean(errors.lastName)} helperText={touched.lastName && errors.lastName}
                            sx={{ gridColumn: 'span 2' }}
                          />
                          <TextField label="Location" name="location" onBlur={handleBlur} onChange={handleChange}
                            value={values.location} error={touched.location && Boolean(errors.location)} helperText={touched.location && errors.location}
                            sx={{ gridColumn: 'span 4' }}
                          />
                          <TextField label="Occupation" name="occupation" onBlur={handleBlur} onChange={handleChange}
                            value={values.occupation} error={touched.occupation && Boolean(errors.occupation)} helperText={touched.occupation && errors.occupation}
                            sx={{ gridColumn: 'span 4' }}
                          />
                          <Box gridColumn="span 4" border={`1px dashed ${theme.palette.primary.main}`} borderRadius="5px" p="1rem">
                            <Dropzone multiple={false} onDrop={accepted => setFieldValue('picture', accepted[0])}>
                              {({ getRootProps, getInputProps }) => (
                                <Box {...getRootProps()} sx={{ '&:hover': { cursor: 'pointer' } }}>
                                  <input {...getInputProps()} />
                                  {!values.picture ? <Typography>Add Picture Here</Typography> : (
                                    <FlexBetween>
                                      <Typography>{values.picture.name}</Typography>
                                      <EditOutlinedIcon />
                                    </FlexBetween>
                                  )}
                                </Box>
                              )}
                            </Dropzone>
                          </Box>
                        </>
                      )}

                      <TextField
                        label="Email"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{ gridColumn: 'span 4' }}
                      />
                      <TextField
                        label="Password"
                        type="password"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ gridColumn: 'span 4' }}
                      />
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ px: isNonMobile ? 6 : 2, py: 1.5, fontWeight: 'bold' }}
                        fullWidth={!isNonMobile}
                      >
                        {isLogin ? 'LOGIN' : 'REGISTER'}
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Grid>

            {/* Right Panel: Toggle */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                background: 'linear-gradient(135deg, #00B894 0%, #55EFC4 100%)',
                color: '#FFF',
                p: isNonMobile ? 8 : 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {isLogin ? 'New Here?' : 'Already Have an Account?'}
              </Typography>
              <Typography sx={{ mb: 6, textAlign: 'center' }}>
                {isLogin ? 'Sign up and discover new opportunities!' : 'Login to continue!'}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setPageType(isLogin ? 'register' : 'login')}
                sx={{
                  bgcolor: '#FFF',
                  color: theme.palette.primary.main,
                  px: 6,
                  py: 2,
                  fontWeight: 'bold',
                  borderRadius: '999px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#F0F0F0' },
                  minWidth: 140,
                }}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;
