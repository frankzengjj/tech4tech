import { withRouter } from 'next/router'
import { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert'
import { API } from '../../../config'
import Layout from '../../../components/Layout'

const ActivateAccount = ({ router }) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        buttonText: 'Activate Account',
        success: '',
        error: ''
    })
    const { name, token, buttonText, success, error } = state

    const clickSubmit = async e => {
        e.preventDefault()
        console.log('activating account')
        setState({ ...state, buttonText: 'Activating' })

        try {
            const response = await axios.post(`${API}/register/activate`, { token })
            console.log(response)
            setState({ ...state, name: '', token: '', buttonText: 'Activated', success: response.data.message })
        } catch (error) {
            console.log('error is', error)
            setState({ ...state, buttonText: 'Activate Account', error: error.response.data.error })
        }
    }

    useEffect(() => {
        let token = router.query.id
        if (token) {
            const { name } = jwt.decode(token)
            setState({ ...state, name, token })
        }
    }, [router])
    return <Layout>
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <h1>Hello {name}, Click to activate the account</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                <button
                    disabled={buttonText === "Activated"}
                    className="btn btn-outline-success btn-block"
                    onClick={clickSubmit}>
                    {buttonText}
                </button>
            </div>
        </div>
    </Layout>
}

export default withRouter(ActivateAccount)