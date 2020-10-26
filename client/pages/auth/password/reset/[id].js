import Router, { withRouter } from 'next/router'
import { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../../../../helpers/alert'
import { API } from '../../../../config'
import Layout from '../../../../components/Layout'

const ResetPassword = ({router}) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset Password',
        success: '',
        error: ''
    })
    const { name, token, newPassword, buttonText, success, error } = state

    useEffect(() => {
        const decoded = jwt.decode(router.query.id)
        if (decoded) setState({...state, name: decoded.name, token: router.query.id }) 
    }, [router])

    const handleChange = e => {
        setState({ ...state, newPassword: e.target.value, success: '', error: '' })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setState({
            ...state, email:'', buttonText: 'Resending'
        })
        try {
            const response = await axios.put(`${API}/reset-password`, {resetPasswordLink: token, newPassword})
            setState({
                ...state, email:'', buttonText: 'Password Reset', success: response.data.message
            })
        } catch (error) {
            console.log(`Reset PW ERROR ${error}`)
            setState({
                ...state, buttonText: 'Reset Password', error: error.response.data.error
            })
        }
    }

    const resetPasswordForm = () => (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Type your new password"
                        required
                    />
                </div>
                <div>
                    <button>{buttonText}</button>
                </div>
            </form>
        </div>

    )

    return (
        <Layout>
                <div className="register-form col-md-6 offset-md-3">
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {resetPasswordForm()}
                </div>
        </Layout>
    )
}

export default withRouter(ResetPassword)