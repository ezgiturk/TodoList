import React from 'react'
import Redirect from "react-router/es/Redirect";
import AppBarView from "./AppBarView";
import Checkbox from '@material-ui/core/Checkbox';
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import AddRounded from "@material-ui/icons/AddRounded";
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './Notes.css';
import {Collapse} from 'mdbreact';
import DatePicker from "react-datepicker";
import Modal from "react-responsive-modal";
import {CreateStyleSheetOptions as index} from "jss";

export default class Notes extends React.Component{

    constructor(props) {
        super(props);

        this.state = {

            pass: [],
            items: [],
            done: [],
            startDate: moment(),
            checked: false,
            collapse: false,
            open: false,
            taskText: ""
        };

        this.toggle = this.toggle.bind(this);
        this.addItem = this.addItem.bind(this);
        this.onChecked = this.onChecked.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onTaskInputChange = this.onTaskInputChange.bind(this);

    }
    isAuthenticated() {
        const token = localStorage.getItem('token');
        return token && token.length > 10;
    }
    onTaskInputChange(e){
        e.preventDefault();
        this.setState({
            taskText: e.target.value
        });
    }
    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }
    addItem(e) {
        e.preventDefault();
        const taskText = this.state.taskText;

        if (taskText !== "") {
         let newItem = {
             note: taskText,
             deadline: this.state.startDate.toString(),
             done: false,
             id: 0
         };
            console.log("newItem: " , newItem);
         const formData = new FormData();
         formData.append("note", taskText);

         const formattedDate = this.state.startDate ? moment(this.state.startDate).format("YYYY-MM-DD HH:mm"): null;
         if (formattedDate)
            formData.append("deadline", formattedDate);

         fetch('http://127.0.0.1:8000/notes/',
        {
            method: 'POST',
            headers: {
                Authorization: 'Token '+ localStorage.getItem('token'),
            },
            body:(formData)

        })
         .then( response => {
            if (!response.ok) { throw response }
            return response
        })
        .then(items => {
            console.log("success", items);
            this.fetchData();
            this.onCloseModal();
        }
        )
         .catch(error => {
             console.log("some errors", error)
         });
        }
    }
    fetchData(){
        fetch('http://127.0.0.1:8000/notes/',
             {
                 method: "GET",
                 headers:{
                     Authorization: 'Token '+ localStorage.getItem('token'),
                 }
             })
             .then((Response)=>Response.json())

             .then(items => {
                 console.log("items first: ", items);
                 this.setState(
                     {items: items});
             });
    }
    componentDidMount(){
        this.fetchData();


         fetch('http://127.0.0.1:8000/notes/done/',
             {
                 method: "GET",
                 headers:{
                     Authorization: 'Token '+ localStorage.getItem('token'),
                 }
             })
             .then((Response)=>Response.json())
             .then(done => {
                 console.log("done:", done);
                 this.setState({done})
             });

    }
    onDelete(item, e) {
        console.log("item: ",item," ", item.id);
        fetch('http://127.0.0.1:8000/notes/' + item.id, {
            method: 'DELETE',
            headers: {
                Authorization: 'Token '+ localStorage.getItem('token'),
            },
        })

        .then(json => console.log(json))
        .then(items => this.setState(
            {items : this.state.items.filter(function (filter_item){
                return (item.id !== filter_item.id)
            } )}))
        .then(done => this.setState(
            {done : this.state.done.filter(function (filter_item){
                return (item.id !== filter_item.id)
            } )}));
    };
    onChecked(item,e) {
        e.preventDefault();
        console.log(item);
        fetch('http://127.0.0.1:8000/notes/' + item.id, {
            method: 'PUT',
            headers: {
                Authorization: 'Token '+ localStorage.getItem('token'),
            },
        })
            .then(() => {
            console.log("checked ",this.state.checked);
            if (!this.state.checked) {
                this.setState({ checked:true});

                this.setState(
                    {items: this.state.items.filter(function (filter_item) {
                            return (item.id !== filter_item.id)
                        })
                    });
                this.setState((prevState) => {
                    return {
                        done: prevState.done.concat(item)
                    };
                })
            }
            else{
                this.setState({ checked:false});

                this.setState(
                    {done: this.state.done.filter(function (filter_item) {
                            return (item.id !== filter_item.id)
                        })
                    });
                this.setState((prevState) => {
                    return {
                        items: prevState.items.concat(item)
                    };
                })
            }
        })
    };

    onOpenModal(){
        this.setState({ open: true });
    };
    onCloseModal(){
        this.setState({ open: false });
    };

    render() {
        let tempDate = new Date();
        const currDate = tempDate;
        const { open } = this.state;

        const isAlreadyAuthenticated =this.isAuthenticated();

        return (
            <div className="header">
                <AppBarView/>
                {!isAlreadyAuthenticated ? <Redirect to='/login'/> : <div className="todoList">

                        <AddRounded className="addNote" onClick={this.onOpenModal.bind(this)}>Open modal</AddRounded>
                        <Modal open={open} onClose={this.onCloseModal.bind(this)} center>
                            <form onSubmit={this.addItem}>
                                <input value={this.state.taskText} onChange={this.onTaskInputChange.bind(this)}
                                       placeholder="enter task"/>
                                <DatePicker selected={this.state.startDate} onChange={(date)=> this.setState({startDate: date})}/>
                                <button className="submit" type="submit">Add</button>
                            </form>
                        </Modal>

                        <ul className="list-group">{
                            this.state.items.map((item, index) =>{
                                let itemDate = new Date(item["deadline"]);
                                console.log(itemDate);
                                console.log("itemDate",((itemDate)) );

                                if( (itemDate).getTime()  > (currDate).getTime()){
                                    return <li key={index} className="list-group-item shadow-sm">{item['note']}
                                        <DeleteOutlined onClick={this.onDelete.bind(this, item)} className="delete"/>
                                        <Checkbox checked={false} onClick={this.onChecked.bind(this, item)} className="checked"/>
                                    </li>}
                                else{
                                    return <li style={{backgroundColor:"#F38181"}} key={index} className="list-group-item shadow-sm">{item['note']}
                                        <DeleteOutlined onClick={this.onDelete.bind(this, item)} className="delete"/>
                                        <Checkbox checked={false} onClick={this.onChecked.bind(this, item)} className="checked"/>
                                    </li>
                                }
                                }
                            )}
                        </ul>
                    <hr/>
                        <AddRounded className="addNote" onClick={this.toggle.bind(this)} style={{marginBottom: "1rem"}}/>
                        <Collapse isOpen={this.state.collapse}>
                            <ul className="list-group done">{
                                this.state.done.map((item, index) =>
                                    <li key={index} className="list-group-item shadow-sm">{item['note']}
                                        <DeleteOutlined onClick={this.onDelete.bind(this, item)} className="done-delete"/>
                                        <Checkbox checked={true} onClick={this.onChecked.bind(this, item)} className="checked"/>
                                    </li>
                                )}
                            </ul>
                        </Collapse>

                    </div>
                }
            </div>
        )
    };
}

//<btn onClick={Notes.deleteHandler.bind(this)} className="btn btn-danger btn-sm">Delete</btn>
//                        <NotesItem entries={this.state.items}/>