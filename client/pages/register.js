import Layout from '../components/Layout'
import { useState, useEffect } from 'react/'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../helpers/alert'
import { API } from '../config'
import { authenticate, isAuth } from '../helpers/auth'

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

    useEffect(() => {
        isAuth() && Router.push('/')
    }, [])

    const { name, email, password, error, success, bottomText } = state
    const handleSubmit = async e => {
        e.preventDefault()
        setState({ ...state, bottomText: 'Registering...' })
        try {
            const response = await axios.post(`${API}/register`, {
                name,
                email,
                password
            })
            console.log(`get response...`)
            console.log(response)
            setState({
                ...state,
                name: '',
                email: '',
                password: '',
                bottomText: 'Submitted',
                success: response.data.message
            })
        } catch (error) {
            console.log(`caught error...`)
            console.log(error)
            setState({ ...state, bottomText: 'Register', error: error.response.data.error })
        }
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
                        required
                    />
                </div >

                <div className="form-group">
                    <input
                        value={state.email}
                        onChange={handleChange('email')}
                        type="text"
                        className="form-control"
                        placeholder="Type Your email"
                        required
                    />
                </div>

                <div className="form-group" >
                    <input
                        value={state.password}
                        onChange={handleChange('password')}
                        type="password"
                        className="form-control"
                        placeholder="Type your password"
                        required
                    />
                </div>
                <button disabled={state.bottomText === "Submitted"}>{state.bottomText}</button>
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
            {/* {success && success}
            {error && error} */}
            <div className="register-form col-md-6 offset-md-3">
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {registerForm()}
            </div>
        </Layout>
    )
}

export default Register
