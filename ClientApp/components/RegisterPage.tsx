import '../css/RegisterPage.css';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import { NavLink } from "react-router-dom";

export class RegisterPage extends React.Component<RouteComponentProps<{}>, any> {

    MIN_USER_LEN = 4;
    MIN_PASS_LEN = 4;

    constructor() {
        super();
        
        this.state = {
            Username: '',
            Password: '',
            users: [],
            retypedPassword: '',
            formValidation: false
        };
    }

    public componentDidMount() {
        axios.get('Users/GetUsers')
            .then(response => {
                console.log(response.data);

                this.setState((prevState, props) => {
                    return { users: response.data }
                });
                return response.data;
            });

    }

    /**
     *  Handles input when leaving (onblur)
     * @param event
     */
    handleInput = (event: any) => {
        const name = event.target.id;
        const value = event.target.value;
        console.log(name);

        this.setState((prevState, props) => {
            return { [name]: value }
        });
        console.log(name + " " + value);
        this.formValidateLeave(name, value);
    }

    /**
     *  Trying to get form validation done might try to have states hold boolean variables
     * @param name
     * @param value
     */
    formValidateLeave(name: String, value: String) {

        let isCorrect: Boolean = true;

        const error = document.getElementById(`${name}Error`);
        if (error == null) {
            console.log(`${name}Error`);
            console.log("null)");
        } else {
            switch (name) {
                case 'username':
                    if (value.length < this.MIN_USER_LEN) {
                        isCorrect = false;
                        error.textContent = "Must be more than 4 characters long";

                        break;
                    }

                    for (let user of this.state.users) {
                        if (user === value) {
                            error.textContent = "This username already exists, please choose another.";
                            isCorrect = false;
                            break;
                        }
                    }

                    break;
                case 'password':
                    if (value.length < this.MIN_PASS_LEN) {
                        error.textContent = "Must be more than 4 characters long";
                        isCorrect = false;
                    }

                    break;
                case 'retypedPassword':
                    if (value != this.state.Password) {
                        error.textContent = "Passwords do not match";
                        isCorrect = false;
                    }
                    break;
                default:
                    break;
            }

            if (isCorrect) {
                error.textContent = '';
            }

            this.setState((prevState, props) => {
                return { formValidation: isCorrect }
            });
        }
    }

    /**
     * Used for checking on change if there was an error after first entering
     * @param event
     */
    formValidateOnChange(event: any) {
        const name = event.target.id;
        const value = event.target.value;
        const error = document.getElementById(`${name}Error`);
        let isCorrect: Boolean = true;
        if (error == null) {
            console.log(`${name}Error`);
            console.log("null)");
        } else {
            if (error.textContent != '') {

                switch (name) {
                    case 'username':
                        if (value.length < this.MIN_USER_LEN) {
                            isCorrect = false;
                            error.textContent = "Must be more than 4 characters long";

                            break;
                        }

                        for (let user of this.state.users) {
                            if (user === value) {
                                error.textContent = "This username already exists, please choose another.";
                                isCorrect = false;
                                break;
                            }
                        }

                        break;
                    case 'password':
                        if (value.length < this.MIN_PASS_LEN) {
                            error.textContent = "Must be more than 4 characters long";
                            isCorrect = false;
                        }

                        break;
                    case 'retypedPassword':
                        if (value != this.state.Password) {
                            error.textContent = "Passwords do not match";
                            isCorrect = false;
                        }
                        break;
                    default:
                        break;
                }

                if (isCorrect) {
                    error.textContent = '';
                }

                this.setState((prevState, props) => {
                    return { formValidation: isCorrect }
                });
            }
        }    
    }

    /**
     * When the submit button is pressed will do a form check
     * If it passes it sends it redirects, otherwise redo register
     * @param event
     */
    handleSubmit(event: any) {
        // Prevents reloading page
        event.preventDefault();
        // Rechecks everything
        this.formValidateLeave("username", this.state.Username);
        this.formValidateLeave("password", this.state.Password);
        this.formValidateLeave("retypedPassword", this.state.retypedPassword);

        if (this.state.formValidation) {
            console.log(this.state.Username + " " + this.state.Password);
            const sendingObject = {
                ID: 12,
                Username: this.state.Username,
                Password: this.state.Password,
                Salary: 0.0
            }
            // Send the state to the api to create a user and redirect
            axios.post('Users/Register', 
                sendingObject
                )
                .then(response => {
                    console.log(response.data);
                })
                .then(res => {
                    this.props.history.push('/');
                })
                .catch(error => {
                    console.log(error);
                })
        } else {
            console.log("Everything is not validated");
        }
    }

    /**
     * Renders the registration page
     */
    public render() {
        console.log(this.state);

        return (
            <div className="register-page">
                <div className="content-boxes container">
                    <form className="form-signin" onSubmit={e => this.handleSubmit(e)}>
                        <h2 className="form-signin-heading"> Register </h2>

                        <p className="form-label"> Username: </p>
                        <label className="sr-only"> Username </label>
                        <input type="text" ref="username" id="Username" className="form-control" placeholder="Username"
                            required onBlur={e => this.handleInput(e)} onChange={e => this.formValidateOnChange(e)} />
                        <div className="error" id="usernameError" />

                        <p className="form-label"> Password (Must be more than 4 characters long): </p>
                        <label className="sr-only"> Password </label>
                        <input type="password" ref="password" id="Password" className="form-control" placeholder="Password"
                            required onBlur={e => this.handleInput(e)} onChange={e => this.formValidateOnChange(e)} />
                        <div className="error" id="passwordError" />

                        <p className="form-label"> Re-Type Password: </p>
                        <label className="sr-only"> Re-Type Password </label>
                        <input type="password" ref="retypedPassword" id="retypedPassword" className="form-control" placeholder="Password"
                            required onBlur={e => this.handleInput(e)} onChange={e => this.formValidateOnChange(e)}/>
                        <div className="error" id="retypedPasswordError" />

                        <button className="btn btn-sm btn-primary btn-block" type="submit"> Create an Account
                        </button>
                    </form>
                </div>

                <div className="content-boxes container back">
                    <p> Already have an account? <NavLink to={'/'} activeClassName='active'>Sign in here!
                            </NavLink></p>
                </div>

            </div>


        );
    }
}
