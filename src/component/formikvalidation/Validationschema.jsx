import * as Yup from "yup";

const nameValidation = Yup.string()
  .min(3, "Name must be at least 3 characters")
  .required("Name is required");

const emailValidation = Yup.string()
  .email("Invalid email address format")
  .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, "Please enter a valid email")
  .required("Email is required");

const passwordValidation = Yup.string()
  .min(6, "Password must be at least 6 characters")
  .required("Password is required");

const confirmPasswordValidation = Yup.string()
  .oneOf([Yup.ref("password"), null], "Passwords must match")
  .required("Confirm Password is required");

// Signup schema
export const signupValidationSchema = Yup.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

// Login schema (reuses same email & password rules)
export const loginValidationSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

// Forgot password schema
export const forgotPasswordValidationSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

// Add this at the end of Validationschema.jsx

export const resetPasswordValidationSchema = Yup.object({
  email: emailValidation,
  oldPassword: passwordValidation.label("Old Password"),
  newPassword: passwordValidation.label("New Password"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

export const productValidationSchema = Yup.object({
  products_name: Yup.string()
    .min(3, "Product name must be at least 3 characters")
    .required("Product name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  color: Yup.string().required("Please select a color"),
  selectedCategoryId: Yup.number()
    .typeError("Category is required")
    .required("Category is required"),
  // tags are optional
  products_image: Yup.mixed().when("isEdit", {
    is: false,
    then: (schema) => schema.required("Product image is required"),
    otherwise: (schema) => schema.notRequired(),
  })
});