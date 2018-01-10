/**
    Handles inserting a new item into the table
*/
import * as React from 'react';
import axios from 'axios';
import '../css/NewButton.css';


export interface customBody {
    columns: any,
    validateState: any,
    ignoreEditable: any,
    onSave: any,
    onModalClose: any,

}


export class NewButton extends React.Component<customBody, any> {

    constructor(props: customBody) {
        super(props);

        this.state = {
            createItem: true,
            tags: [],
            userId: localStorage.getItem("userId")
        }

        this.handleInput = this.handleInput.bind(this);
        this.tagSelection = this.tagSelection.bind(this);
        this.onHandleNewKey = this.onHandleNewKey.bind(this);
        this.onHandleNewItem = this.onHandleNewItem.bind(this);
    }

    componentDidMount() {
        console.log("Mounted input body");
        this.tagSelection();
    }

    // handles validation
    handleSaveBtnClick = (columns: any, onSave: any, onModalClose: any) => {

        const newRow = {};
        console.log(this.props.columns);

        if (this.state.createItem) {

            let saveRow = true;
            this.props.columns.forEach((column, i) => {
                if (column.field != "dateOfPurchase") {
                    console.log(column);
                    const columnField = this.refs[column.field] as HTMLInputElement
                    console.log(this.state[column.field])
                    let value = this.state[column.field];
                    const error = document.getElementById(`${column.field}Error`);
                    if (error != null) {
                        // Validates if anything is entered 
                        if (value == undefined || value == "") {
                            let name = column.field
                            if (name == "itemName") {
                                name = "item name"
                            }
                            error.textContent = "Please enter a " + name + ".";
                            saveRow = false;
                        } else {
                            newRow[column.field] = this.state[column.field];
                            error.textContent = "";
                        }
                    }


                } else {
                    const d = new Date();
                    const year = d.getFullYear();
                    const day = d.getDay();
                    const month = d.getMonth();
                    let time: String = d.toLocaleTimeString();
                    time = time.slice(0, time.length - 3);
                    console.log(time);
                    const date: String = year + "-" + month + "-" + day + " " + time;
                    console.log(date);
                    newRow[column.field] = date;
                }

            }, this);

            // Gets the value of the tag
            var e = (document.getElementsByClassName("tag-selection").item(0)) as HTMLSelectElement;
            var sel = e.selectedIndex;
            var opt = e.options[sel].attributes[0].value;
            var CurValue = opt;
            console.log("Tag value: " + CurValue);
            newRow["tagId"] = CurValue;
            newRow["itemCreation"] = this.state.itemType;
            if (saveRow) {
                onSave(newRow);
            }
        } else {
            let { tagName, userId } = this.state;
            const error = document.getElementById(`tagNameError`);

            if (error != null) {
                if (tagName == "" || tagName == undefined) {
                    error.textContent = "Please enter a tag name.";
                } else {
                    error.textContent = "";
                    axios.post('Users/InsertTag',
                        {
                            UserID: this.state.userId,
                            TagName: this.state.tagName,
                            Color: 'f'
                        })
                        .then(response => {
                            console.log(response.data);
                        });
                    onModalClose();
                }
            }
        }
    }

    // Sets the state to the value typed
    handleInput(event: any) {
        const name = event.target.id;
        let value = event.target.value;
        let setState = true;
        console.log(event.target);

        if (name == 'cost') {
            //Validate with regular expression that it is a money input
            const nonNumericRegex = /[^0-9.\-]/g;

            // Only converts to money if it contains numbers, ., and -
            if (!nonNumericRegex.test(value)) {
                value = this.convertToMoney(value);

            } else {
                setState = false;
            }
        }

        if (setState) {
            this.setState((prevState, props) => {
                return { [name]: value }
            });
        }

        console.log(name + " " + value);

    }

    /**
     * Converts the input int a float that will be used for currency
     * @param input
     */
    convertToMoney(input: string) {
        const minusRegex = /^\-/g;
        let negative: boolean = minusRegex.test(input);   // True if regex 
        let value = input;
        // Replaces all non numbers or dots
        value = value.replace(/[^0-9.]/g, '');
        // replace multiple dots with a single dot
        value = value.replace(/\.+/g, '.');
        // only allow 2 digits after a dot
        value = value.replace(/(.*\.[0-9][0-9]?).*/g, '$1');
        // replace multiple zeros with a single one
        value = value.replace(/^0+(.*)$/, '0$1');
        // remove leading zero
        value = value.replace(/^0([^.].*)$/, '$1');
        let floatValue = parseFloat(value);
        if (negative) {
            floatValue *= -1;
        }
        console.log(floatValue)
        return floatValue;
    }

    // Generates the selection based on tags
    tagSelection() {
        const fakeTags = [
            { UserID: 1, ID: 1, TagName: "tag1" },
            { UserID: 1, ID: 2, TagName: "tag2" },
            { UserID: 1, ID: 3, TagName: "tag3" }
        ]

        axios.post('Users/GetAllTags',
            {
                ID: this.state.userId
            })
            .then(response => {
                let newSelectionItems: any = [];
                let receivedTags: any = response.data;
                receivedTags.forEach((tag, index) => {
                    console.log(tag);
                    newSelectionItems.push(<option value={tag.id} key={tag.id + 1}>{tag.tagName}</option>)
                })
                this.setState(() => {
                    return { tags: newSelectionItems }
                })
            });

    }

    onHandleNewItem() {
        this.setState((prev, props) => {
            return { createItem: true }
        })
    }

    onHandleNewKey() {
        this.setState((prev, props) => {
            return { createItem: false }
        })
    }

    render() {
        const {
      onModalClose,
            onSave,
            columns,
            validateState,
            ignoreEditable
        } = this.props;

        let header = (
            <div>
                <div className="modal-header react-bs-table-inser-modal-header">
                    <h3> Create New Item</h3>
                        <button className='btn btn-info' onClick={this.onHandleNewKey} > New Tag</button>
                </div>
            </div>
        );
        

        let body = (
            <div className='modal-body'>
                <div className="create-item">
                    <label> Item Name: </label>
                    <input type="text" ref="itemName" id="itemName" className="form-control" placeholder="Name of Item" onChange={this.handleInput} />
                    <div className="error" id="itemNameError" />
                    <label> Cost: </label>
                    <input type="text" ref="cost" id="cost" className="form-control" placeholder="Value of Item" onChange={this.handleInput} />
                    <div className="error" id="costError" />
                    <label> Tags: </label>
                    <select className="form-control tag-selection" >
                        {this.state.tags}
                    </select>
                </div>
            </div>
        );

        if (!this.state.createItem) {
            header = (
                <div>
                    <div className="modal-header react-bs-table-inser-modal-header">
                        <h3> Create New Tag</h3>
                        <button className='btn btn-info' onClick={this.onHandleNewItem} > New Item</button>
                    </div>
                </div>
            );

            body = (
                <div className='modal-body'>
                    <div className="create-Tag">
                        <p> Tag Name: </p>
                        <input type="text" ref="tagName" id="tagName" className="form-control" placeholder="Name of Tag" onChange={this.handleInput} />
                        <div className="error" id="tagNameError" />
                    </div>
                </div>
            );
        }        return (
            <div style={{ backgroundColor: 'white' }} className='modal-content'>
                { header }
                <div>
                    { body }
                </div>
                <div className="modal-footer react-bs-table-inser-modal-footer">
                    <span>
                        <button className='btn btn-default' onClick={onModalClose}>Close</button>
                        <button className='btn btn-success' onClick={() => this.handleSaveBtnClick(columns, onSave, onModalClose)}>Create</button>
                    </span> 
                </div>
            </div>
        );
    }
}