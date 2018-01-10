import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import '../css/Footer.css';

export interface footerprops {
    handleclickbutton: (open: boolean) => void;
}

// allows the constructor to take in props and state
export class Footer extends React.Component<footerprops, any> {

    constructor(props: footerprops, context) {
        super(props);

        console.log(props);
        console.log(context);
        this.state = {
            visible: true,
            openPanel: false
        };

        // Must bind this so handleClick has access to this
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick() {

        const openPanel = !this.state.openPanel;
        this.props.handleclickbutton(openPanel);

        this.setState((prevState, props) => {
            return { openPanel: openPanel }
        });

        //if (openPanel) {
        //    // Allows us to change the style attribute
        //    document.getElementsByClassName("footer").item(0).setAttribute("style", "right: 250px");
        //} else {
        //    document.getElementsByClassName("footer").item(0).setAttribute("style", "right: 0px");
        //}
    }

    public render() {
        return (
            <div className="footer">
                <button type="button" className="addItem" onClick={this.handleClick} >
                    <span className="glyphicon glyphicon-chevron-left"></span>
                </button>
            </div>
        );
    }
}
export default Footer;