/* eslint-disable no-console */
import React, { Component } from 'react'
import axios from 'axios'

class RegistrationForm extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      confirmPassword: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
    console.log('sign-up handleSubmit, username: ')
    console.log(this.state.username)
    event.preventDefault()

    //request to server to add a new username/password
    axios
      .post('/users/register', {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div>
        <h4>Sign up</h4>
        <form className="form-horizontal">
          <div>
            <div>
              <label className="form-label" htmlFor="username">
                Email
              </label>
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
                className="form-input"
                placeholder="password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <button onClick={this.handleSubmit} type="submit">
            Sign up
          </button>
        </form>
      </div>
    )
  }
}

export default RegistrationForm
