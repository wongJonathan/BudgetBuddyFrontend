import '../css/LoginPage.css';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';



// <Props, state>
export class LoginPage extends React.Component<RouteComponentProps<{}>, any> {
    MIN_USER_LEN = 4;
    MIN_PASS_LEN = 4;

    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            formValidation: true,
            invalidPassword: false
        }; 
    }

    /**
     *  Handles input when leaving (onblur)
     * @param event
     */
    handleInput = (event: any) => {
        const name = event.target.id;
        const value = event.target.value;
        console.log(event.target);
        this.setState((prevState, props) => {
            return { [name]: value }
        });
        console.log(name + " " + value);
    }

    //@todo form validation for input fields


    /**
     * When the submit button is pressed will do a form check
     * Sends the data to backend, if it finds a username and password continues 
     * @param event
     */
    handleSubmit(event: any) {
        event.preventDefault();
        if (this.state.formValidation) {
            console.log(this.state.username + " " + this.state.password);
            // Send the state to the api to check if a user and password work
            let output = axios.post('Users/Login',
                {
                    Username: this.state.username,
                    Password: this.state.password
                })
                .then(response => {
                    console.log(response.data);
                    // Reponse data will contain both the username that is found and the id
                    // checks if the return is the username indicating it exists
                    if (response.data[0] == this.state.username) {
                        // successful login
                        console.log(response.data + "SUCCESSFUL LOGIN");
                        localStorage.setItem("userId", response.data[1]);
                        this.setState((prevState, props) => {
                            return {
                                invalidPassword: false
                            }
                        });
                        return true;
                    }
                    else {
                        // unnsuccessful login - display failure msg
                        console.log("FAILED LOGIN");
                        this.setState((prevState, props) => {
                            return {
                                password: "",
                                invalidPassword: true
                            }
                        });
                        return false;
                    }
                })
                .then(isSuccessful => {
                    if (isSuccessful) {
                        const error = document.getElementById(`usernameError`);
                        if (error != null) {
                            error.textContent = "";
                        }
                        // Goes to homepage
                        this.props.history.push('/homePage');
                    } else {
                        const error = document.getElementById(`usernameError`);
                        if (error != null) {
                            error.textContent = "Invalid login please try again.";
                        }
                    }
                });

            console.log(output)
        } else {
            console.log("Everything is not validated");
        }
    }

    /**
     * Renders the Login page
     */
    public render() {
        console.log(this.state);
        return (
            <div className="log-in-page">
                <div className="content-boxes container">
                    <form className="form-signin" onSubmit={e => this.handleSubmit(e)}>
                        <h1 className="title"><strong> Budget Buddy</strong> </h1>
                        <h2 className="form-signin-heading"> Log In </h2>

                        <p className="form-label"> Username: </p>
                        <label className="sr-only"> Username </label>
                        <input type="text" value={this.state.username} ref="username" id="username" className="form-control" placeholder="Username"
                            required onChange={e => this.handleInput(e)} />
                        <div className="error" id="usernameError" />

                        <p className="form-label"> Password (Must be more than 4 characters long): </p>
                        <label className="sr-only"> Password </label>
                        <input type="password" value={ this.state.password } ref="password" id="password" className="form-control" placeholder="Password"
                            required onChange={e => this.handleInput(e)}/>
                        <div className="error" id="passwordError" />

                        <button className="btn btn-sm btn-primary btn-block" type="submit"> Log In
                            </button>
                    </form>
                </div>

                <div className="content-boxes container sign-up">
                    <p> Don't have an account? <NavLink to={'/registerPage'} activeClassName='active'>Sign up here!
                            </NavLink></p>
                </div>
            </div>
        );
    }
}


