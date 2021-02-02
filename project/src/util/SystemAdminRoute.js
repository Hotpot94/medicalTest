import React,{useState} from 'react'
import { Route, Redirect } from "react-router-dom"

function SystemAdminRoute({ component: Component, role, ...rest }) {
    return (
        <div>
        {role === "System Admin" && (
        <Route
        {...rest}
        render={props => {
            return (<Component {...props} />)
        }}
        ></Route>
        )}

        {/* //route back to patient homepage */}
        {role === "Medical Doctor" && (
        <Route
        {...rest}
        render={props => {
            return (<Redirect to="/MedDoc" />)
        }}
        ></Route>
        )}

       {role === "Patient" && (
       <Route
       {...rest}
       render={props => {
           return (<Redirect to="/Patient" />)
       }}
       ></Route>
       )}

        </div>
    )
}

export default SystemAdminRoute
