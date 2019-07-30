/* eslint-disable no-console */
import React, { Component } from 'react'
import axios from 'axios'

class LoginForm extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    console.log('handleSubmit')
    axios
      .post('/user/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log('login response: ')
        console.log(response)
        if (response.status === 200) {
          // update App.js state
          this.props.updateUser({
            loggedIn: true,
            username: response.data.username
          })
          // update the state to redirect to home
          this.setState({
            redirectTo: '/'
          })
        }
      })
      .catch(error => {
        console.log('login error: ')
        console.log(error)
      })
  }

  render() {
    return (
      <div>
        <form>
          <div>
            <div>
              <label htmlFor="username">Username</label>
            </div>
            <div>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <div>
              <label htmlFor="password">Password: </label>
            </div>
            <div>
              <input
                placeholder="password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <button onClick={this.handleSubmit} type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default LoginForm
