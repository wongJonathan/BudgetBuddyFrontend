/**
    The right side bar that holds the tables and buttons to interact with the table
*/
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { BootstrapTable, TableHeaderColumn, InsertModalHeader, InsertButton } from 'react-bootstrap-table';
import { NewButton } from './NewButton';
import axios from 'axios';
import '../css/RightSideBar.css';

export interface rightSideBarProps {
    exitClick: () => void;
    getItems: () => any;
    setDisplayData: (tagId: number) => void;
    items: any;
}

/**
 * Should be responsible in adding items from the user
 */
export class RightSideBar extends React.Component<rightSideBarProps, any> {


	constructor(props: rightSideBarProps) {
		super(props);
		this.state = {
			visible: true,
			items: this.props.items,
            width: '100px',
            tableHeight: (window.innerHeight - 34) + 'px',
            userId: localStorage.getItem("userId"),
            validate: false,
            expand: false,
            numSelected: 0,
            itemType: true,
            currentTag: -1
        };

		this.handleExitClick = this.handleExitClick.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.getItems = this.getItems.bind(this);
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
        this.handleRowSelect = this.handleRowSelect.bind(this);
        this.onAfterInsertRow = this.onAfterInsertRow.bind(this);
        this.createExpandButton = this.createExpandButton.bind(this);
        this.expand = this.expand.bind(this);
        this.customToolBar = this.customToolBar.bind(this);

        this.buttonFormater = this.buttonFormater.bind(this);
        this.createFakeData = this.createFakeData.bind(this);
	}

	componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.getItems();

    }

	componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    /**
     * Calls the database to get an updated list of items to display
     */
    getItems() {
        // Since getItems returns a promise object, 
        // we need .then to get the data when it actually is sent
        this.props.getItems().then((data) => {
            this.setState((prevState, props) => {
                return { items: data }
            });
            console.log(data);
        });
        
    }

    /**
     * Gets the screen height to calculate the table height
     */
    updateDimensions() {
        const screenHeight = window.innerHeight;

        // 200 is hardcoded input height and 34 is hardcoded exit button
        const newTableHeight = (screenHeight - 34) + 'px';
        this.setState((prevState, props) => {
            return { tableHeight: newTableHeight }
        });
    }

    // Closes the table
	handleExitClick() {
		this.props.exitClick();
    }

    onAfterDeleteRow(rowKeys, rows) {

        // Goes through each row and deletes it individually
        rows.forEach((row, index, rows) => {
            const deletedItem = {
                UserID: this.state.userId,
                ID: row.id,
                ItemName: row.itemName
            };
            console.log(deletedItem);
            axios.post('Users/DeleteItem', deletedItem)
                .then(response => {
                    console.log(response.data);
                    // Reupdate the table
                    this.getItems();
                })
        })
        // Removes the selected rows so now no rows are selected
        this.setState((prevState, props) => {
            return { numSelected: 0 }
        });
    }

    handleRowSelect(row, isSelected, e) {
        console.log(isSelected)
        if (isSelected) {
            this.expand(true)
            this.setState((prevState, props) => {
                return {
                    rowIsSelected: true,
                    numSelected: this.state.numSelected + 1
                }
            });
        } else {
            this.setState((prevState, props) => {
                return {
                    rowIsSelected: false,
                    numSelected: this.state.numSelected - 1
                }
            });
        }
    }

    // Handles the submit to the database
    onAfterInsertRow(row) {
        if (row["name"] != "" && row["cost"] != null) {
            axios.post('Users/InsertItem',
                {
                    UserID: this.state.userId,
                    ItemName: row["itemName"],
                    DateOfPurchase: new Date(),
                    Cost: row["cost"],
                    TagId: row["tagId"]
                })
                .then(response => {
                    console.log(response.data);
                    this.getItems();
                });
              
        }
         
        
    }

    createFakeData(current, max) {
        if (current < max) {
            let oldDate = new Date(2017, 1, 1, 1, 1, 1, 1);
            oldDate.setDate(oldDate.getDate() + current);
            let number = Math.floor(Math.random() * 200) - 100;
            let tag = Math.floor(Math.random() * 3);
            let itemName = "Item " + current;
            if (number > 0) {
                itemName = "Pay Check";
            }

            axios.post('Users/InsertItem',
                {
                    UserID: this.state.userId,
                    ItemName: itemName,
                    DateOfPurchase: oldDate,
                    Cost: number,
                    TagId: tag

                })
                .then(response => {
                    console.log(response.data);
                    this.createFakeData(current + 1, max);
                });
        }
    }
    
    createExpandButton = (onClick) => {
        return (
            <InsertButton
                btnText="Expand"
                btnContextual='btn-primary'
                btnGlyphicon='glyphicon-triangle-left'
                onClick={() => {
                    // Sets the expand value
                    this.setState((prevState, props) => {
                        return {
                            expand: !this.state.expand,
                        }
                    }, () => { this.expand(this.state.expand) });
                }} />
            );
    }

    // Expands the table width
    expand(expand: Boolean) {
        const tableContainer = document.getElementsByClassName("tableContainer");
        let elem = document.getElementsByClassName("rightSide").item(0);
        let style = getComputedStyle(elem).getPropertyValue("--width-right-side");
        let offset = parseInt(style.slice(0, style.length - 2));
        console.log("Offset: " + offset);
        if (expand) {
            tableContainer.item(0).setAttribute("style", "width: 600; margin-left: -300px");
        } else if (!expand && this.state.numSelected <= 0) {
            tableContainer.item(0).setAttribute("style", "width: "+offset+"px; margin-left: 0px");
        }
    }

    // Gives the toolbar a classname for css purposes
    customToolBar = props => {
        return (
            <div className="tableBtnGroup">
                {props.components.btnGroup}
            </div>

        );
    }

    // Creates the tag as a button
    buttonFormater(cell, row) {
        const className = "tag-bt-" + row.tagID+" btn btn-info";
        let buttonTag = (<button type="button" className={className} onClick={() => {
            if (this.state.currentTag != row.tagID) {
                this.props.setDisplayData(row.tagID);
                this.setState(() => {
                    return { currentTag: row.tagID }
                })
            } else {
                this.props.setDisplayData(-1);
                this.setState(() => {
                    return { currentTag: -1 }
                })
            }
        }}>{cell}</button>);
        return (buttonTag);

    }

    // Formats the date to MM-DD-YYYY
    dateFormater(cell, row) {
        let date = row.dateOfPurchase.split("T")[0];
        date = date.split("-");
        let dateString = date[1] + "-" + date[2] + "-" + date[0];
        return dateString;
    }

    // Creates the custom insertmodal when pressing new
    createCustomModal = (onModalClose, onSave, columns, validateState, ignoreEditable) => {
        const attr = {
            onModalClose, onSave, columns, validateState, ignoreEditable
        };
        return (
            <NewButton { ...attr } />
        );
    }

    public render() {

        console.log(this.state);
		// Options for the table
		const options = {
            afterDeleteRow: this.onAfterDeleteRow,
            afterInsertRow: this.onAfterInsertRow,
            insertModal: this.createCustomModal,
            exportCSVBtn: this.createExpandButton,
            toolBar: this.customToolBar
        }

        // For selecting rows
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: this.handleRowSelect,
            bgColor: '#FFBD33',     // Orange to matche delete color
            hideSelectColumn: true
        }

        const { width, tableHeight } = this.state;      

        const tableContainer = document.getElementsByClassName("tableContainer");
        if (tableContainer.item(0) != null) {
            if (this.state.numSelected <= 0 && !this.state.expand) {
                this.expand(false);
            }
        }


		return(
		<div className="rightSideBar">
			<div className="closeRightSideBar">
				<button className="exitSideBar" onClick={this.handleExitClick}>
					<span className="glyphicon glyphicon-remove"></span>
				</button>
            </div>  
            <div className="tableContainer">
			    <BootstrapTable
                        data={this.state.items}
                        options={options}
                        maxHeight={tableHeight}
                        deleteRow={true}
                        selectRow={selectRowProp}
                        insertRow={true}
                        exportCSV={true}
				    >
					    <TableHeaderColumn dataField="itemName"  > Name </TableHeaderColumn>
					    <TableHeaderColumn dataField="cost"  dataAlign='right' > Amount </TableHeaderColumn>
                        <TableHeaderColumn dataField="dateOfPurchase" dataFormat={this.dateFormater} isKey={true} dataAlign='right' > Date </TableHeaderColumn>
                        <TableHeaderColumn dataField="tagName" dataFormat={this.buttonFormater}> Tag </TableHeaderColumn>
			    </BootstrapTable>
            </div>
		</div >);
	}
}

