import * as yup from "yup";

const studentSchema = (isEdit) => yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  name: yup
    .string()
    .min(2, "Tên Học sinh phải có ít nhất 2 ký tự")
    .required("Tên Học sinh là bắt buộc"),
  age: yup.string().required("Tuổi là bắt buộc"),
  student_class: yup.string().required("Lớp học là bắt buộc"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  guardian: yup.string().required("Phụ huynh là bắt buộc"),
  guardian_phone: yup.string().required("Số điện thoại phụ huynh là bắt buộc"),
  ...(isEdit ? {} : {
    password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirm_password: yup.string()
      .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
      .required('Xác nhận mật khẩu là bắt buộc'),
  }),
});

export default studentSchema;
