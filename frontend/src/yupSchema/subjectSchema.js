import * as yup from "yup";

const subjectSchema = yup.object().shape({
  
  subject_name: yup.string().min(2, "Tên Môn học phải có ít nhất 2 ký tự").required("Tên Môn học là bắt buộc"),
  subject_code: yup
    .string()
    .required("Số Môn học là bắt buộc"),
});

export default subjectSchema;
