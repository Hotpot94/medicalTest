import React, {useState} from 'react'
import {firestore} from '../firebase';
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import {Link, BrowserRouter} from 'react-router-dom';
import * as admin from "firebase-admin";

export const StaffInput = (props) => {

    //react hooks
    const [doctor, setDoctor] = useState([])
    const [user, setUser] = useState([])

    //fetches data on render
    React.useEffect(()=>{
        const fetchData = async () =>{
           firestore.collection("Medical Doctors").limit(1)
           .where("Email", "==", String(props.medicalStaff.Email))
           .get()
           .then(function(data){
              console.log(data)
                 setDoctor(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
           }); 

           firestore.collection("Users").limit(1)
           .where("Email", "==", String(props.medicalStaff.Email))
           .get()
           .then(function(data){
              console.log(data)
                 setUser(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
           }); 
        };
        fetchData();
     }, [])

     const doc = {...doctor[0]}
     const u = {...user[0]}

    return (<>
        <div>
        <Link to = {{
            pathname: '/SysAdm/viewIndvAcc',
            state: {user: props.medicalStaff}
        }}>
        <Button className = "btn btn-success">Edit</Button></Link>
        <Link to = {{
            pathname: '/SysAdm/confirmDel',
            state: {user: props.medicalStaff}
        }}><button class = "btn btn-danger">Delete</button></Link>
        </div>
    </>
    )
}