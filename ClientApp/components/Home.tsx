import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { SideBar } from './SideBar';
import { Layout } from './Layout';
import axios from 'axios';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    constructor(props: any) {
        super();


    }

    componentDidMount() {
        // Redirects the user to the login page if localstorage is empty
        if (localStorage.getItem("userId") == null) {
            this.props.history.push('/');
        }

    }

    public render() {
        return (
            <Layout>
                <div>
                    
                </div>
            </Layout>
            
        )
    }
}


