import * as Yup from "yup";

const periodSchema = Yup.object().shape({
  teacher: Yup.string().required("Required"),
  subject: Yup.string().required("Required"),
  period: Yup.string().required("Required"),
  date: Yup.date().required("Required"),
});

export default periodSchema;