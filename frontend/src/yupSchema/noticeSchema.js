import * as Yup from "yup";

const noticeSchema = Yup.object().shape({
  title: Yup.string().required("Tiêu đề không được để trống"),
  message: Yup.string().required("Nội dung không được để trống"),
  audience: Yup.string().required("Người xem không được để trống"),
});

export default noticeSchema;
