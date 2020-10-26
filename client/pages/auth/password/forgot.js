import { Router } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert'
import { API } from '../../../config'
import Layout from '../../../components/Layout'

const ForgotPassword = () => {
    const [state, setState] = useState({
        email: '',
        buttonText: 'Send Link',
        success: '',
        error: ''
    })
    const { email, buttonText, success, error } = state

    const handleChange = e => {
        setState({ ...state, email: e.target.value, buttonText: 'Send Link', success: '', error: '' })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setState({
            ...state, email:'', buttonText: 'Sending'
        })
        try {
            const response = await axios.put(`${API}/forgot-password`, {email})
            setState({
                ...state, email:'', buttonText: 'Link Sent', success: response.data.message
            })
        } catch (error) {
            console.log(`FORGOT PW ERROR ${error}`)
            setState({
                ...state, buttonText: 'Send Link', error: error.response.data.error
            })
        }
    }

    const passwordForgotForm = () => (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Type your email"
                        required
                    />
                </div>
                <div>
                    <button disabled={buttonText==='Link Sent'}>{buttonText}</button>
                </div>
            </form>
        </div>

    )

    return (
        <Layout>
                <div className="register-form col-md-6 offset-md-3">
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {passwordForgotForm()}
                </div>
        </Layout>
    )
}

export default ForgotPassword;