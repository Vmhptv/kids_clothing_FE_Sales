import React, { useEffect } from "react";
import axios from "axios";
import "./index.css";

import {
  CButton,
  CForm,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useState } from "react";
import { setUserSession, setPassSession } from "../common/Common";
// -----------------
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const Login = () => {
  const [id, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    const user = {
      username: userName,
      password: passWord,
    };
    axios
      .post(`http://localhost:8080/api/auth/login`, user)
      .then((response) => {
        if (
          response.data.data.roles.toString() === "ROLE_ADMIN" || response.data.data.roles === "ROLE_STAFF"
        ) {
          setLoading(false);
          setUserSession(
            response.data.data.id,
            passWord,
            response.data.data.token,
            response.data.data.username
          );
          window.location.href = "/sales";
          alert("Đăng nhập thành công");
        } else {
          alert("Bạn không có quyền");
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Account password is incorrect");
      });
  };
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Login</h1>
        <TextField
          label="Tên đăng nhập"
          placeholder="Username"
          variant="standard"
          color="warning"
          focused
          value={userName}
          onChange={(e) => setUserName(e.target.value.toString())}
          style={{ width: "100%", marginBottom: "20px", fontSize: "20px" }}
          InputLabelProps={{
            style: { color: "blue" },
          }}
          InputProps={{
            style: { color: "black" },
          }}
        />

        <TextField
          label="Mật khẩu"
          variant="standard"
          color="warning"
          focused
          name="password"
          type="password"
          placeholder="Password"
          value={passWord}
          onChange={(e) => setPassword(e.target.value.toString())}
          style={{ width: "100%" }}
          InputLabelProps={{
            style: { color: "blue" },
          }}
          InputProps={{
            style: { color: "black" },
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
};
export default Login;
