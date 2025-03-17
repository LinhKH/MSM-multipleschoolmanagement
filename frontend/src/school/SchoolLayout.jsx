import { useState, useEffect, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";

// ICON
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SubjectIcon from "@mui/icons-material/Subject";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventIcon from "@mui/icons-material/Event";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ExplicitIcon from "@mui/icons-material/Explicit";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

import { AuthContext } from "../context/AuthContext";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function SchoolLayout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  const location = useLocation();

  const { user } = useContext(AuthContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navArr = [
    {
      link: "/",
      component: "Home",
      icon: HomeIcon,
    },
    {
      link: "/school",
      component: "Dashboard",
      icon: DashboardCustomizeIcon,
    },
    {
      link: "/school/class",
      component: "Class",
      icon: FormatListNumberedIcon,
    },
    {
      link: "/school/subjects",
      component: "Subjects",
      icon: SubjectIcon,
    },
    {
      link: "/school/students",
      component: "Students",
      icon: PersonOutlineIcon,
    },
    {
      link: "/school/teachers",
      component: "Teachers",
      icon: PeopleAltIcon,
    },
    {
      link: "/school/schedule",
      component: "Schedule",
      icon: EventIcon,
    },
    {
      link: "/school/attendance",
      component: "Attendance",
      icon: RecentActorsIcon,
    },
    {
      link: "/school/examinations",
      component: "Examinations",
      icon: ExplicitIcon,
    },
    {
      link: "/school/notice",
      component: "Notice",
      icon: NotificationsIcon,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= theme.breakpoints.values.sm) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme.breakpoints.values.sm]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "",
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
            >
              School Management System [ Multiple ]
            </Typography>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
            >
              {user.school_name} | Role: {user.role}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navArr.map((text, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: "block",
                backgroundColor:
                  location.pathname === text.link ? "#1976d2" : "inherit",
              }}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
                onClick={() => navigate(text.link)}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {<text.icon />}
                </ListItemIcon>
                <ListItemText
                  primary={text.component}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ flexGrow: 1 }} />
        <ListItem
          disablePadding
          sx={{
            display: "block",
            backgroundColor: "inherit",
          }}
        >
          <ListItemButton
            sx={[
              {
                minHeight: 48,
                px: 2.5,
                marginBottom: "auto",
              },
              open
                ? {
                    justifyContent: "initial",
                  }
                : {
                    justifyContent: "center",
                  },
            ]}
            onClick={() => navigate("/logout")}
          >
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  justifyContent: "center",
                },
                open
                  ? {
                      mr: 3,
                    }
                  : {
                      mr: "auto",
                    },
              ]}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Đăng xuất"
              sx={[
                open
                  ? {
                      opacity: 1,
                    }
                  : {
                      opacity: 0,
                    },
              ]}
            />
          </ListItemButton>
        </ListItem>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
