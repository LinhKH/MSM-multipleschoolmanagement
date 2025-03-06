import * as yup from "yup";

const registerSchema = yup.object().shape({
  school_name: yup
    .string()
    .required("Tên trường học là bắt buộc")
    .min(6, "Tên trường học phải có ít nhất 6 ký tự")
    .max(20, "Tên trường học phải có tối đa 20 ký tự"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  owner_name: yup
    .string()
    .required("Tên hiệu trưởng là bắt buộc")
    .min(3, "Tên hiệu trưởng phải có ít nhất 3 ký tự")
    .max(20, "Tên hiệu trưởng  phải có tối đa 20 ký tự"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu phải có tối đa 50 ký tự"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

export default registerSchema;
