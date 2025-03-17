import { Outlet } from 'react-router-dom';
import Navbar from './utility_component/navbar/Navbar';
import Footer from './utility_component/footer/Footer';
import { Box } from '@mui/material';

const ClientLayout = () => {
  return (
    <div>
      <Navbar />
      <Box sx={{ minHeight: '80vh', alignItems: "center", }} component={'div'}>
        <Outlet />
      </Box>
      <Footer />
    </div>
  )
}

export default ClientLayout
