import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button, Link, Typography } from "@material-ui/core";
import { useSignupLoginStyles } from "./signupLoginStyle";
import FormikTextField from "../FormikTextField";
import * as yup from "yup";
import { fetchLogin } from "../../utils/auth/fetchLogin";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { useRouter } from "next/dist/client/router";

interface LoginProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const validSchema = yup.object({
  email: yup
    .string()
    .required()
    .max(64)
    .matches(/^[a-zA-Z0-9]+(@[a-zA-Z0-9]+\.[a-z]+)$/, "Invalid Email"),
  password: yup.string().required().min(6),
});

const Login: React.FC<LoginProps> = ({ setPage }) => {
  const classes = useSignupLoginStyles();
  const router = useRouter();
  const [openError, setOpenError] = useState(false);
  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validSchema}
        onSubmit={async (data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const res = await fetchLogin(data);
          if (!res.done) {
            console.log("ERROR FROM BACKEND");
            setOpenError(true);
          } else {
            resetForm();
            router.push("/");
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.root} noValidate autoComplete="off">
            <FormikTextField
              label="Email"
              className={classes.input}
              name="email"
            />
            <FormikTextField
              name="password"
              label="Password"
              type="password"
              className={classes.input}
            />
            <Button
              disabled={isSubmitting}
              color="inherit"
              variant="contained"
              type="submit"
              className={classes.btn}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <Typography align="center" className={classes.footer}>
        <Link className={classes.link} onClick={() => setPage(2)}>
          Forgot password?
        </Link>
      </Typography>
      <Typography align="center" className={classes.footer}>
        No Account?{" "}
        <Link className={classes.link} onClick={() => setPage(1)}>
          Create one
        </Link>
      </Typography>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Invalid email or password
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
