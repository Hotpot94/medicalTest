import React,{useState} from 'react'
import {Link, withRouter, useLocation, useHistory} from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { auth, firestore } from '../firebase';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function ConfirmDelete() {
    const [error, setError] = useState("");     // store error message
    const {state} = useLocation();              // access appointment passed from link router
    const {user} = state;                // save appointment data from state
    const history = useHistory();
    const [doctor, setDoctor] = useState([])
    const [medStaff, setMedStaff] = useState([])
    const [medAdm, setMedAdm] = useState([]);

    React.useEffect(()=>{
        const fetchData = async () =>{
           firestore.collection("Medical Doctors")
           .where("Email", "==", String(user.Email))
           .get()
           .then(function(data){
              console.log(data)
                 setDoctor(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
           }); 

           firestore.collection("Medical Staff")
           .where("Email", "==", String(user.Email))
           .get()
           .then(function(data){
              console.log(data)
              setMedStaff(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
           }); 

           firestore.collection("Medical Administrator")
           .where("Email", "==", String(user.Email))
           .get()
           .then(function(data){
              console.log(data)
              setMedAdm(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
           }); 
        };
        fetchData();
     }, [])

     const deleteAccountAlert = () => {
        confirmAlert({
          title: 'Deleted!',
          message: 'Account was Deleted successfully.',
          buttons: [
            {
              label: 'OK',
            },
          ]
        });
      };

     const doc = {...doctor[0]}
     const ms = {...medStaff[0]}
     const ma = {...medAdm[0]}

    //handle submit
   const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try{
            if(user.Role === "Medical Doctor")
            {
                await firestore.collection("Medical Doctors").doc(doc.id).delete()
                await firestore.collection("Medical Staff").doc(ms.id).delete()
                await firestore.collection("Users").doc(user.id).delete()
                .then(() =>{
                    deleteAccountAlert();
                })
            }
            if(user.Role === "Medical Admin")
            {
                await firestore.collection("Medical Administrator").doc(ma.id).delete()
                await firestore.collection("Medical Staff").doc(ms.id).delete()
                await firestore.collection("Users").doc(user.id).delete()
                .then(() =>{
                    deleteAccountAlert();
                })
            }
            if(user.Role === "Patient" || user.Role === "System Admin")
            {
                await firestore.collection("Users").doc(user.id).delete()
                .then(() =>{
                    deleteAccountAlert();
                })
            }
            history.push("/SysAdm/viewAllAccount");
        }
        catch(error)
        {
            return setError(error.message);
        }
   }
    return (
        <div>
            <Container className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "50vh"}}>
          <div className="w-100" style={{maxWidth: "400px"}}>
          <Card>
             <Card.Body>
                <Card.Title className= "text-center">Confirm Delete</Card.Title>
                <label class="note">The following account will be deleted from Database:</label>
                {error && <Alert variant="danger">{error}</Alert>}
                 <Form onSubmit={handleSubmit} className="my-4">
                 <Form.Group id = "email">
                        <Form.Label className="my-2">Email</Form.Label>
                        <Form.Control 
                        defaultValue ={user.Email}
                        disabled = {true}
                        type="text" required/>
                  </Form.Group>
                  <Form.Group id = "role">
                        <Form.Label className="my-2">Role</Form.Label>
                        <Form.Control 
                        defaultValue ={user.Role}
                        disabled = {true}
                        type="text" required/>
                  </Form.Group>
                <Button className="w-100 my-2" type="submit">Delete</Button>
                <Button className="w-100 my-2" type="submit" target="_blank" href="https://console.firebase.google.com/u/0/project/myappointment-bb30e/authentication/users">Delete Authentication</Button>
                <Link to={'/SysAdm/viewAllAccount'}>
                    <Button className="w-100 my-2">Return</Button></Link>
                </Form>
                </Card.Body>
                </Card>
                </div>
                </Container>
        </div>
    )
}

export default ConfirmDelete
