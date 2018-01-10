import * as React from 'react';
import { NavMenu } from './NavMenu';
import { SideBar } from './SideBar';
import { Footer } from './Footer';
import { RightSideBar } from './RightSideBar';
import { Graph } from './Graph';
import axios from 'axios';
import '../css/layout.css';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, any> {
    constructor() {
        super();

        this.state = {
            openPanel: false,
            userId: localStorage.getItem("userId"),
            items: [],
            graphItems: []
        }
        // Must bind here when passing in a callback function
        this.footerButtonPress = this.footerButtonPress.bind(this);
        this.rightSideBarCallBack = this.rightSideBarCallBack.bind(this);
        this.getItems = this.getItems.bind(this);
        this.setGraphData = this.setGraphData.bind(this);
    }

    componentDidMount() {
        this.getItems();
    }

    public footerButtonPress(open: Boolean) {
        console.log(open);
        this.setState((prevState, props) => {
            return { openPanel: open }
        });
    }

    public rightSideBarCallBack() {
        this.setState((prevState, props) => {
            return { openPanel: false }
        });
    }

    // Call back for components that need the items from the db
    public getItems() {
        console.log("Update");

        // Gets the new items after submitting it
        let data = axios.post('Users/GetItems',
            {
                UserID: this.state.userId,
                TagID: -1
            })
            .then(response => {
                console.log(response.data);
                this.setState((prevState, props) => {
                    return { items: response.data }
                });
                return response.data;
            });
        console.log(data);
        return data;
    }

    public setGraphData(tagId: number) {
        let data = axios.post('Users/GetItems',
            {
                UserID: this.state.userId,
                TagID: tagId
            })
            .then(response => {
                console.log("set graph data too: ");
                console.log(response.data);
                this.setState((prevState, props) => {
                    return { graphData: response.data }
                });
                return response.data;
            });
    }




    public render() {
        console.log(this.state);
        let openPanel = this.state.openPanel;
        let { graphData, items } = this.state;
        let displayData = (graphData == undefined) ? items : graphData;
        console.log(items);
        console.log(displayData);

        return <div className='container-fluid' style={{ right: openPanel ? '250px' : '0px' }}>
            

            <div className='row'>
                <div className='col'>

                </div>
                
                <div className='col-sm-auto'>
                    <div className='row'>
                        {
                            !!openPanel && 
                            <div className='rightSide'>
                                <RightSideBar exitClick={this.rightSideBarCallBack} setDisplayData={this.setGraphData} getItems={this.getItems} items={items}/>
                            </div>
                        }
                        <Graph getItems={this.getItems} items={displayData} openPanel={openPanel} />
                    
                        </div>
                </div>
            </div>
            {
                !openPanel &&
                <Footer handleclickbutton={this.footerButtonPress} />
            }

        </div>;
    }
}
