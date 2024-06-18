import React from "react";
import { Formik } from "formik";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

// Yup
let yup = require("yup");

let bounceTimeout = null;
function debounce(fn, args, timeout) {
  if (bounceTimeout) {
    clearTimeout(bounceTimeout);
  }
  return new Promise((resolve) => {
    bounceTimeout = setTimeout(() => resolve(fn(args)), timeout);
  });
}

function trueMailValidate(value) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.trumail.io/v2/lookups/json?email=${value}`)
      .then((response) => response.json())
      .then(
        (result) => {
          console.log(result);
          resolve(result.deliverable);
        },
        (error) => {
          console.log(error);
          resolve(false);
        }
      );
  });
}

const checkEmail = (value) => debounce(trueMailValidate, value, 500);

let validateSchema = yup.object().shape({
  email: yup
    .string()
    .email("invalid email")
    .required("email is required")
    .test("email", "email validation failed", (email) => {
      return checkEmail(email);
    })
});

const PhoneForm = () => {
  return (
    <Container style={{ marginTop: "20px" }}>
      <Formik
        initialValues={{
          email: ""
        }}
        validationSchema={validateSchema}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 500);
        }}
      >
        {({
          errors,
          values,
          setFieldValue,
          isSubmitting,
          touched,
          handleBlur,
          handleSubmit,
          handleChange
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              label="email"
              fullWidth
              variant="outlined"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.email ? errors.email : ""}
              error={touched.email && Boolean(errors.email)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default PhoneForm;
