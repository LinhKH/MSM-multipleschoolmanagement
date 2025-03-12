import * as Yup from "yup";

const examinationSchema = Yup.object().shape({
  class_exam: Yup.string().required("Lớp học không được để trống"),
  subject: Yup.string().required("Môn học không được để trống"),
  examDate: Yup.date().required("Ngày không được để trống"),
  examType: Yup.string().required("Loại không được để trống"),
});

export default examinationSchema;