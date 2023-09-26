import { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

import UserContext from "../UserContext";
import "../App.css";

export default function Register() {
  const { user } = useContext(UserContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [emailExists, setEmailExists] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();

  const checkEmailExists = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/checkEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmailExists(data.emailExists);

        if (data.emailExists) {
          Swal.fire({
            icon: 'error',
            text: 'Email is already taken. Please choose a different one.'
          });
        }
      });
  };

  function registerUser(e) {
    e.preventDefault();

    if (emailExists) {
      Swal.fire({
        icon: 'error',
        text: 'Email is already taken. Please choose a different one.'
      });
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        mobileNo: mobileNo,
        address: address,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword("");
          setConfirmPassword("");

          Swal.fire({
            icon: 'success',
            text: 'Thank you for registering!'
          }).then(() => {
            navigate("/login");
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Error occurred. Please check your details and try again later.'
          });
        }
      });
  }

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      address !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      mobileNo.length === 11
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [
    firstName,
    lastName,
    email,
    mobileNo,
    password,
    address,
    confirmPassword,
  ]);

  return user.id !== null ? (
    <Navigate to="/products" />
  ) : (
    <Container className="text-left p-5">
      <Row className="justify-content-center">
        <Col className="md-6 p-5">
          <Form onSubmit={(e) => registerUser(e)}>
            <h1 className="mt-5 text-center bannerH1">Register</h1>
            <p className="text-center my-3">
              Already registered? <a href="/login">Log in here!</a>
            </p>
            <Form.Group>
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onBlur={checkEmailExists}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile Number:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter mobile number"
                required
                value={mobileNo}
                onChange={(e) => {
                  setMobileNo(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Form.Group>
            {isActive ? (
              <Button className="my-3 customButton" type="submit">
                Submit
              </Button>
            ) : (
              <Button className="my-3 customButton" disabled>
                Submit
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
