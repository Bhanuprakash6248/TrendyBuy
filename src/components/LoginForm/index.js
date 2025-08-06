import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }
    componentDidMount() {
    if (document.getElementById("kore-sdk")) return;

    const script = document.createElement("script");
    script.id = "kore-sdk";
    script.src =
      "https://cdn.kore.ai/platform/latest/sdk/web/kore-web-sdk-umd-chat.min.js";
    script.async = true;

    script.onload = () => {
      if (window.KoreChatSDK) {
        const botOptions = {
          clientId: "cs-f127be5f-513c-5f8a-ad2c-2df1e2cc16ef",
          clientSecret: "sj8oJ2k8DXnqTIffg1ESQzytdnzqjbsOs30bHj7gkdo=", // optional if using JWTUrl
          // JWTUrl: "https://yourdomain.com/api/kore/generate-jwt", // If you're using JWT instead of clientSecret
          botInfo: {
            name: "Bank Assist Bot01",
            _id: "st-626badf6-a46b-50a4-ac50-e2e2a1f1e3cc",
          },
          userIdentity: "bhanu@example.com",
          isAnonymous: false,
        };

        if (!window.koreChatInstance) {
          window.koreChatInstance = new window.KoreChatSDK.chatWindow(botOptions);
          window.koreChatInstance.show(document.getElementById("chatContainer"));
        }
      } else {
        console.error("❌ KoreChatSDK not loaded");
      }
    };

    script.onerror = (e) => {
      console.error("❌ Failed to load Kore SDK script", e);
    };

    document.body.appendChild(script);
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="rahul@2021"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="rahul"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <img
          src="/assets/logo.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />

        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="/assets/logo.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />

          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
        <div id="chatContainer" style={{ width: "100%", height: "500px" }}></div>
      </div>
    )
  }
}

export default LoginForm
