/**
    Component for displaying graph
*/
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import '../css/Graph.css';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, LineMarkSeries } from 'react-vis';

export interface graphProps {
    getItems: (tagId: number) => any;
    items: any;
    openPanel: Boolean;
}

// allows the constructor to take in props and state
export class Graph extends React.Component<graphProps, any> {

    constructor(props: graphProps) {
        super(props);

        console.log(props);
        this.state = {
            items: this.props.items,
            graphData: [],
            graphHeight: (window.innerHeight - 5),
            graphWidth: (window.innerWidth),
            offset: 0
        };


        this.convertItems = this.convertItems.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);

    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        let elem = document.getElementsByClassName("lineChart").item(0);
        let style = getComputedStyle(elem).getPropertyValue("--left-graph-padding");
        let offset = parseInt(style.slice(0, style.length - 2));
        console.log("Offset: " + offset);
        this.setState((prev, props) => {
            return { offset: offset }
        });
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    /**
     * Called when the props are changed
     * @param nextProps updated props
     */
    componentWillReceiveProps(nextProps) {
        console.log("new props");
        console.log(nextProps);
        this.convertItems(nextProps.items);
        this.setState(() => {
            return {
                openPanel: nextProps.openPanel
            }
        }, this.updateDimensions)
    }

    /**
     * Gets the screen size to calculate the graph width and height
     */
    updateDimensions() {

        const screenHeight = window.innerHeight;
        let screenWidth = window.innerWidth - this.state.offset;

        // 300 is hardcoded width of right side
        if (this.state.openPanel) {
            screenWidth -= 300;
            console.log("panel change");
        }

        const newGraphHeight = (screenHeight);

        this.setState((prevState, props) => {
            return {
                graphHeight: newGraphHeight,
                graphWidth: screenWidth
            }
        });
    }


    /**
     * Converts the items received to something the table understands
     * @param items
     */
    convertItems(items: any) {
        let newItemsList: any = [];
        let total = 0.0;
        items.forEach((item, index) => {
            let newItem = {};
            total += item.cost;
            newItem['y'] = total;
            newItem['x'] = new Date(item.dateOfPurchase);
            newItemsList.push(newItem);
        });

        this.setState((prevState, props) => {
            return { graphData: newItemsList }
        });
    }

    public render() {
        console.log(this.state);

        // Checks if the data is empty
        if (this.state.graphData.length <= 0) {
            return (
                <div className="lineChart">
                    <h1>Presse the arrow in the bottom right corner to add items!</h1>
                </div>  
                )
        } else {
            return (
                <div className="lineChart">
                    
                    <XYPlot
                        width={this.state.graphWidth}
                        height={this.state.graphHeight}
                        xType={'time'}
                    >
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        <LineMarkSeries
                            data={this.state.graphData}
                        />
                        <XAxis title="Date" />
                        <YAxis title="Profit" />
                    </XYPlot>
                </div>
            )
        }
    }
}