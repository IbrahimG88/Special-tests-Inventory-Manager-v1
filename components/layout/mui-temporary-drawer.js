import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Head from "next/head";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

export default function TemporaryDrawer() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };
  return (
    <>
      <nav className="flex items-center justify-between px-4 py-2 bg-slate-900">
        <IconButton
          style={{ color: "white" }}
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon className="text-white hover:text-lime-500" />
        </IconButton>

        <h4 className="text-2xl font-bold  text-white transform perspective-500 rotate-x-15 rotate-y-15">
          <a href="./" className="text-white hover:text-lime-500">
            MedLab Inventory Manager
          </a>
        </h4>

        <div className="flex space-x-4 p-3"> </div>
      </nav>
      <Box height="1rem" />
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <List>
          {[
            {
              name: "Inventory",
              icon: <Inventory2OutlinedIcon />,
              href: "./mui-table-search",
            },
            {
              name: "Notification",
              icon: <NotificationsOutlinedIcon />,
              href: "./expiree-notifications",
            },
            {
              name: "Add Stocks",
              icon: <AddShoppingCartOutlinedIcon />,
              href: "./stocks-to-add-3",
            },
            {
              name: "Create Order",
              icon: <CreateNewFolderOutlinedIcon />,
              href: "./create-order",
            },
          ].map((item, index) => (
            <div key={item.name}>
              <Link href={item.href}>
                <ListItem
                  button
                  key={item.name}
                  sx={{
                    borderRadius: "10px",
                    marginBottom: "10px",
                    marginRight: "50px",
                  }}
                  className="hover:bg-amber-200 hover:text-black"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              </Link>
            </div>
          ))}
        </List>
        <Divider />
        <List>
          {[
            {
              name: "Settings",
              icon: <SettingsOutlinedIcon />,
              href: "./settings",
            },
          ].map((item, index, icon) => (
            <div key={item.name}>
              <Link href={item.href}>
                <ListItem
                  button
                  key={item.name}
                  sx={{
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                  className="hover:bg-amber-200 hover:text-black"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              </Link>
              <ListItem
                button
                key={item.name}
                sx={{
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
                className="hover:bg-amber-200 hover:text-black"
                onClick={() => {
                  toggleDrawer(false);
                  signOut();
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="SignOut" />
              </ListItem>
            </div>
          ))}
        </List>
      </Drawer>
    </>
  );
}
