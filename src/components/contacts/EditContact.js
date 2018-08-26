/*
 npm install uuid - help create unique id's
 */
import React, { Component } from 'react'
import { Consumer } from "../../context"
import TextInputGroup from '../layout/TextInputGroup'
import axios from 'axios'

//import uuid from "uuid"

class EditContact extends Component {
    state = {
        name: "",
        email: "",
        phone: "",
        errors: {}
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        const res = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)

        const contact = res.data;
        this.setState({
            name: contact.name,
            email: contact.email,
            phone: contact.phone
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (dispatch, e) => {
        e.preventDefault()

        const { name, email, phone } = this.state

        // Check for errors
        if (name === "") {
            this.setState({ errors: { name: "Name is required" } })
            return
        }
        if (email === "") {
            this.setState({ errors: { email: "Email is required" } })
            return
        }
        if (phone === "") {
            this.setState({ errors: { phone: "Phone is required" } })
            return
        }

        const updContact = {
            name,
            email,
            phone
        }

        const { id } = this.props.match.params
        const res = await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updContact)

        dispatch({ type: "UPDATE_CONTACT", payload: res.data })

        // Clear state
        this.setState({
            name: "",
            email: "",
            phone: "",
            error: {}
        })

        // Redirect
        this.props.history.push("/")
    }

    render() {
        const { name, email, phone, errors } = this.state
        return (
            <Consumer>
                {value => {
                    const { dispatch } = value
                    return (
                        <div className="card mb-3">
                            <div className="card-header">Edit Contact</div>
                            <div className="card-body">
                                <form onSubmit={this.onSubmit.bind(this, dispatch)}>
                                    <TextInputGroup
                                        label="Name"
                                        name="name"
                                        placeholder="Enter name..."
                                        value={name}
                                        onChange={this.onChange}
                                        error={errors.name}
                                    />
                                    <TextInputGroup
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter email..."
                                        value={email}
                                        onChange={this.onChange}
                                        error={errors.email}
                                    />
                                    <TextInputGroup
                                        label="Phone"
                                        name="phone"
                                        placeholder="Enter phone..."
                                        value={phone}
                                        onChange={this.onChange}
                                        error={errors.phone}
                                    />
                                    <input
                                        type="submit"
                                        value="Update Contact"
                                        className="btn btn-light btn-block"
                                    />
                                </form>
                            </div>
                        </div>
                    )
                }}
            </Consumer>
        )
    }
}

export default EditContact