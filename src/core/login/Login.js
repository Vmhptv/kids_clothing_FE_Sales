import React from 'react'
import axios from 'axios'
import "./index.css";

import {
  CButton,
  CForm,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useState } from 'react'
import { setUserSession,setPassSession } from '../common/Common'


export default function Login() {
  const [id, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [passWord, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)


  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios
      .post(`http://localhost:8080/api/auth/login`, { username: userName, password: passWord }).then(response => {
        setLoading(false);
        setUserSession(response.data.data.id,passWord,response.data.data.token, response.data.data.username)
        window.location.href = "/sales"
        alert("Logged in successfully")
      }).catch(error => {
        setLoading(false);
        alert("Account password is incorrect");
      });
  }
  return (
      <div className="container h-100">
        <div className="d-flex justify-content-center h-100">
          <div className="user_card">
            <div className="d-flex justify-content-center">
            </div>
            <CForm>
              <div className="tileLogin">
                <h1>Login</h1>
                <p className="text-medium-emphasis">Sign In to your account</p>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <CInputGroup >
                      <CInputGroupText>
                      </CInputGroupText>
                      <input className="form-control" type="text" name="name" placeholder="Username" autoComplete="username" value={userName} onChange={e => setUserName(e.target.value.toString())} />
                    </CInputGroup>
                  </div>
                </div>
                <div className="input-group mb-2">
                  <div className="input-group-append">
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                      </CInputGroupText>
                      <input
                       className="form-control"
                       name="password"
                        type="password"
                        placeholder="Password"
                        value={passWord} onChange={e => setPassword(e.target.value.toString())}
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                  </div>
                </div>
              </div>
              <CRow>
                <div className="d-flex justify-content-center mt-3 login_container">
                  {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
                  <input type="button" className="btn btn-primary" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
                </div>
                <div className="d-flex justify-content-center links">
                  <CButton color="link" className="px-0">
                    Forgot password?
                  </CButton>
                </div>
              </CRow>
            </CForm>
          </div>

        </div>
      </div>
  )

}
