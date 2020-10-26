import Layout from '../components/Layout'
import { useEffect, useState } from 'react/'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../helpers/alert'
import { API } from '../config'
import { authenticate, isAuth } from '../helpers/auth'

const Login = () => {
    const [state, setState] = useState({
        email: "",
        password: "",
        error: "",
        success: "",
        bottomText: "Login"
    })

    const handleChange = (name) => (event) => {
        setState({ ...state, [name]: event.target.value, error: "", success: "", bottomText: "Login" })
    }

    useEffect(() => {
        isAuth() && Router.push('/')
    }, [])

    const { email, password, error, success, buttonText } = state
    const handleSubmit = async e => {
        e.preventDefault()
        setState({ ...state, bottomText: 'Logging in..' })
        try {
            const response = await axios.post(`${API}/login`, {
                email,
                password
            })
            authenticate(response, () => isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user'))
        } catch (error) {
            console.log(`caught error...`)
            console.log(error)
            setState({ ...state, bottomText: 'Login', error: error.response.data.error })
        }
    }

    const loginForm = () => (
        <div className="form">
            <form onSubmit={handleSubmit}>
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
                <button>{state.bottomText}</button>
                <p className="message">
                <Link href="/auth/password/forgot">
                        <a>Forget Password</a>
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
                {JSON.stringify(isAuth())}
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {loginForm()}
            </div>
        </Layout>
    )
}

export default Login
