import * as Yup from "yup";

const periodSchema = Yup.object().shape({
  teacher: Yup.string().required("Giáo viên không được để trống"),
  subject: Yup.string().required("Môn học không được để trống"),
  period: Yup.string().required("Thời gian không được để trống"),
  date: Yup.date().required("Ngày không được để trống"),
});

export default periodSchema;