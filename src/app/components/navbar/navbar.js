"use client";
import React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";
import { FaHome, FaPalette } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "var(--secondary-bg)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5rem 2rem",
        }}
      >
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            color: "var(--text-primary)",
            textDecoration: "none",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            "&:hover": {
              color: "var(--accent-color)",
            },
          }}
        >
          <FaPalette size={24} />
          Signage Content App
        </Typography>

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Button
            component={Link}
            href="/"
            startIcon={<FaHome />}
            sx={{
              color:
                pathname === "/"
                  ? "var(--accent-color)"
                  : "var(--text-primary)",
              "&:hover": {
                color: "var(--accent-color)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            href="/menu"
            sx={{
              color:
                pathname === "/menu"
                  ? "var(--accent-color)"
                  : "var(--text-primary)",
              "&:hover": {
                color: "var(--accent-color)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Menu
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
