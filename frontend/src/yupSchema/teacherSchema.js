import * as yup from "yup";

const teacherSchema = (isEdit) => yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  name: yup
    .string()
    .min(2, "Tên Giáo viên phải có ít nhất 2 ký tự")
    .required("Tên Giáo viên là bắt buộc"),
  age: yup.string().required("Tuổi là bắt buộc"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  qualification: yup.string().required("Trình độ chuyên môn là bắt buộc"),
  ...(isEdit ? {} : {
    password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirm_password: yup.string()
      .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
      .required('Xác nhận mật khẩu là bắt buộc'),
  }),
});

export default teacherSchema;
