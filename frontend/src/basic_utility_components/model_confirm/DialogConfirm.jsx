import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const DialogConfirm = ({ open, handleClose, handleConfirmDelete, whatDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Bạn có chắc chắn muốn xóa {whatDelete} này không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleConfirmDelete}
          sx={{ background: "red", color: "white" }}
          autoFocus
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirm;
