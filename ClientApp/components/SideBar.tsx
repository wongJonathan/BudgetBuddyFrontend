// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import '../css/SideBar.css';


export class SideBar extends React.Component<{}, {}> {

    constructor() {
        super();
        this.state = {
            visible: true
        };
    }
    public render() {
        return (
            <div className="sidebar">
                <li> Put graphs here </li>
            </div>
        );
    }
}
