
import React, { Component } from 'react';
import './MainView.scss'
import axios from 'axios'

class MainView extends Component {
    constructor(props: any) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        axios.get('https://reqres.in/api/products')
            .then(res => {
                const data = res.data
                this.setState({ ...data })
                console.log(res.data)
                console.log(this.state)
            })
    }
    render() {
        const { data }:any = this.state
        return (
            <div className='MainView'>
                <input className='filterInput' placeholder='filter for id'></input>
                {data.map((element:any, index:any) => {
                    return <p className='ss' key={index} style={{background:`${element.color}`}}> id:{element.id}, name:{element.name}, year:{element.year}</p>
                })}
            </div>
        );
    }
}

export default MainView;