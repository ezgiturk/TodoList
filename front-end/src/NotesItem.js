import React, {Component} from 'react';
import DeleteOutlined from "@material-ui/core/SvgIcon/SvgIcon";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";

class NotesItem extends Component {
    constructor(props) {
        super(props)
        let {item} = this.props;
        this.setState({
            item: item
        })
    }

    render() {
        let {item} = this.props;
        return (
            <li className="list-group-item shadow-sm" key={item['id']}>{item['note']}
                <DeleteOutlined  onClick={this.onDelete.bind(this,item)} className="delete"/>
                <Checkbox onClick={this.onChecked.bind(this,item)} className="checked"/>
            </li>


        );
    }
}
export default NotesItem;