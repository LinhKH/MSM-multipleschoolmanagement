import * as yup from "yup";

const classSchema = yup.object().shape({
  
  class_text: yup.string().min(2, "Tên lớp học phải có ít nhất 2 ký tự").required("Tên lớp học là bắt buộc"),
  class_num: yup
    .string()
    .required("Số lớp học là bắt buộc"),
});

export default classSchema;
