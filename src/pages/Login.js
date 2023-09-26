import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  function authenticate(e) {
    e.preventDefault();

    try {
      fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access) {
            localStorage.setItem("token", data.access);
            retrieveUserDetails(data.access);

            setUser({
              access: localStorage.getItem("token"),
            });

            Swal.fire({
              title: "Welcome!",
              icon: "success",
              text: "You've successfully login!",
            });
          } else {
            Swal.fire({
              title: "Log in failed",
              icon: "error",
              text: "Check your login details and try again.",
            });
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          Swal.fire({
            title: "Server error",
            icon: "error",
            text: "An error occurred while processing your request. Please try again later.",
          });
        });
    } catch (error) {
      console.error("JSON parse error:", error);
      Swal.fire({
        title: "JSON parse error",
        icon: "error",
        text: "An error occurred while parsing the JSON response from the server.",
      });
    }

    setEmail("");
    setPassword("");
  }

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      });
  };

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return user.id !== null ? (
    <Navigate to="/myCart" />
  ) : (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Form onSubmit={(e) => authenticate(e)}>
        <h1 className="mt-5 text-center bannerH1">Login Page</h1>
        <p className="my-3 text-center">Use your Solution Design account to login.</p>
        <Form.Group controlId="userEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button
            className="my-3 customButton"
            type="submit"
            disabled={!isActive}
          >
            Login
          </Button>
        </div>
      </Form>
      <p className="text-center my-3">
        Not yet registered? <a href="/register">Click here</a>!
      </p>
    </div>
  );
}
