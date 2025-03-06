import { Box } from '@mui/material';
import React from 'react'
import SimpleImageSlider from "react-simple-image-slider";

const images = [
  { url: "images/carousel/1.jpg" },
  { url: "images/carousel/2.jpg" },
  { url: "images/carousel/3.jpg" },
  { url: "images/carousel/4.jpg" },
  { url: "images/carousel/5.jpg" },
  { url: "images/carousel/6.jpg" },
  { url: "images/carousel/7.jpg" },
];

const Carousel = () => {
  return (
    <Box>
      <SimpleImageSlider
        width={'100%'}
        height={504}
        images={images}
        showBullets={true}
        showNavs={true}
        autoPlay={true}
      />
    </Box>
  )
}

export default Carousel
