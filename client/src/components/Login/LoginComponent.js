import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/profitdiary/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs" className="mainLogin">
      <form className="formLogin" name="formLogin" onSubmit={handleLogin}>
        <Typography variant="h5" align="center">
          Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          name="username"
          variant="outlined"
          margin="normal"
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          margin="normal"
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
          style={{ backgroundColor: "black", color: "white" }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 1 }}
          onClick={handleRegisterClick}
          style={{ backgroundColor: "black", color: "white" }}
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default LoginComponent;
