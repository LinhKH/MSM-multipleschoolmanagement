import * as yup from "yup";

const loginSchema = yup.object().shape({
  
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu phải có tối đa 50 ký tự"),
});

export default loginSchema;
