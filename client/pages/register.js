import Layout from '../components/Layout'
import { useState } from 'react/'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'

const Register = () => {
    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: "",
        bottomText: "Register"
    })

    const handleChange = (name) => (event) => {
        setState({ ...state, [name]: event.target.value, error: "", success: "", bottomText: "Register" })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.table(state)
    }

    const registerForm = () => (
        <div className="form">
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    value={state.name}
                    onChange={handleChange('name')}
                    type="text" 
                    className="form-control"
                    placeholder="Type your name"
                />
            </div >
            
            <div className="form-group">
                <input 
                    value={state.email}
                    onChange={handleChange('email')} 
                    type="text" 
                    className="form-control" 
                    placeholder="Type Your email"
                />
            </div>
            
            <div className="form-group" >
                <input 
                    value={state.password}
                    onChange={handleChange('password')} 
                    type="text" 
                    className="form-control"
                    placeholder="Type your password"
                />
            </div>
            <button>{state.bottomText}</button>
            <p className="message">
                Already registered? 
                <Link href="/login">
                    <a> Sign In</a>
                </Link>
            </p>
       </form>
       </div>
    )
    return (
        <Layout>
            <div className="register-form col-md-6 offset-md-3">
                {registerForm()}
                <hr/>
                {JSON.stringify(state)}
            </div>
        </Layout>
    )
}

export default Register
