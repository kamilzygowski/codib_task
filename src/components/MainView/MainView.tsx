import React, { Component } from 'react';
import './MainView.scss'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

class MainView extends Component {
    constructor(props: any) {
        super(props)
        this.state = {
            // Prepared list array
            prepared_data: [],
            // It's a currently page displaying
            actual_page: 0,
            // endpoint data
            data: [],
            page: 0,
            per_page: 0,
            total_items: 0,
            total_pages: 0
        }
    }
    componentDidMount() {
        axios.get('https://reqres.in/api/products')
            .then((res) => {
                const data = res.data;
                let preparedData = [];
                for (let i = 0; i < res.data.total_pages; i++) {
                    const slicedArrayPiece = data.data.splice(0, 5)
                    preparedData.push(slicedArrayPiece)
                    console.log(i*5, (i+1)*5)
                    
                }
                console.log(preparedData)
                this.setState({
                    ...data,
                    prepared_data: preparedData,
                    page: res.data.page,
                    actual_page: res.data.page,
                    per_page: res.data.per_page,
                    total_items: res.data.total,
                    total_pages: res.data.total_pages
                })
                console.log(res.data)

                console.log(this.state)
            })
    }
    setNextPage(state: any) {
        const newState = { ...state, actual_page: state.actual_page + 1 }
        return newState;
    }
    setPreviousPage(state:any) {
        const newState = { ...state, actual_page: state.actual_page - 1 }
        return newState;
    }
    arrowClickHandler(keyword: string, actual_page: number, total_pages: number): void {
        if (keyword === 'left' && actual_page > 1) {
            this.setState(this.setPreviousPage)
        } else if (keyword === 'right' && actual_page < total_pages) {
            this.setState(this.setNextPage)
        }
    }
    render() {
        const {prepared_data,actual_page , data, page, per_page, total_items, total_pages}: any = this.state
        return (
            <div className='MainView'>
                <div className='filterDiv'>
                    <input className='filterInput' placeholder='filter for id'></input>
                    <button className='filterButton'>confirm</button>
                </div>
                <ul className='itemsUl'>
                    {prepared_data[actual_page-1] !== undefined ? prepared_data[actual_page-1].map((element: any, index: number) => {
                        return <li className='itemsLi' key={index} style={{ background: `${element.color}` }}> <span>ID:</span> {element.id}  <span>Color:</span> {element.name}  <span>Year:</span> {element.year}</li>
                    }) : null}
                    <div className='pagination'>
                        <FontAwesomeIcon icon={faArrowLeft} className='arrowIcon' onClick={() => this.arrowClickHandler('left', actual_page, total_pages)} />
                        <p>{actual_page}/{total_pages}</p>
                        <FontAwesomeIcon icon={faArrowRight} className='arrowIcon' onClick={() => this.arrowClickHandler('right', actual_page, total_pages)} />
                    </div>
                </ul>
            </div>
        );
    }
}

export default MainView;