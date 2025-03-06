import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { Box, Modal, Button, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function Gallery() {
  const imageUrl = import.meta.env.VITE_FRONTEND_IMAGE_PATH;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [schools, setSchools] = useState([]);

  const handleOpen = (school) => {
    setOpen(true);
    setSelectedImg(school);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedImg(null);
  };

  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/school/all"
        );

        console.log(response);
        setSchools(response.data.schools);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSchools();
  }, []);

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", marginTop: "20px", marginBottom: "20px", textTransform: "uppercase" }}>
        Registered Schools
      </Typography>
      <Box>
        <ImageList sx={{ width: "100%", height: "auto", alignItems: "center" }}>
          {schools.map((item) => (
            <ImageListItem key={item._id}>
              <img
                srcSet={`${imageUrl}${item.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${imageUrl}${item.school_image}?w=248&fit=crop&auto=format`}
                alt={item.school_name}
                loading="lazy"
                onClick={() => handleOpen(item)}
              />
              <ImageListItemBar
                title={item.school_name}
                subtitle={<span>Hiệu trưởng: {item.owner_name}</span>}
                position="below"
              />
            </ImageListItem>
          ))}
        </ImageList>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {selectedImg?.school_image}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <img
                  srcSet={`${imageUrl}${selectedImg?.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${imageUrl}${selectedImg?.school_image}?w=248&fit=crop&auto=format`}
                  alt={selectedImg?.school_name}
                  loading="lazy"
                  width="100%"
                />
              </Typography>
            </Box>
          </Modal>
        </div>
      </Box>
    </>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
  },
];
