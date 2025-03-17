
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function MessageSnackbar({
  mode,
  messa = "success",
  handleClose,
  vertical = "top",
  horizontal = "center"
}) {

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        open={true}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={mode}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messa}
        </Alert>
      </Snackbar>
    </div>
  );
}
