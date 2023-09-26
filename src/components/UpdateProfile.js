import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function UpdateProfileModal({ user, fetchProfileData }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/updateProfile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        fetchProfileData(); // Refresh the profile data after successful update
        handleClose(); // Close the modal
        // Optionally, you can show a success message to the user
        alert("Profile updated successfully!");
      } else {
        // Handle error cases
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle network errors or other issues
      alert("An error occurred while updating your profile. Please try again.");
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="text-center">
        <Button variant="primary" onClick={handleShow} className="customButton">
          Update Profile
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="text-center mt-3">
              <Button className="customButton" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
