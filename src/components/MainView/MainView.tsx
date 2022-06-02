import React, { Component } from 'react';
import './MainView.scss'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

class MainView extends Component {
    constructor(props: any) {
        super(props)
        this.state = {
            inputId: '',
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
                // Prepare data to be sliced to smaller arrays
                const preparedData: [][] = [];
                const copy: any = [...data.data]
                for (let i = 0; i < res.data.total_pages; i++) {
                    // Copy item list array to make filtering and other funcs easier to apply
                    const slicedArrayPiece = copy.splice(0, 5)
                    preparedData.push(slicedArrayPiece)
                }
                this.setState({
                    data: res.data,
                    prepared_data: preparedData,
                    page: res.data.page,
                    actual_page: res.data.page,
                    per_page: res.data.per_page,
                    total_items: res.data.total,
                    total_pages: res.data.total_pages
                })
            })
    }
    setNextPage(state: any) {
        const newState = { ...state, actual_page: state.actual_page + 1 }
        return newState;
    }
    setPreviousPage(state: any) {
        const newState = { ...state, actual_page: state.actual_page - 1 }
        return newState;
    }
    validateFilterInput() {

    }
    filterForId(arr: any, inputValue: string, total_pages: number) {
        let filteredArray;
        filteredArray = [arr.data.filter((element: any) => {
            return element.id === parseInt(inputValue)
        })]
        if (inputValue === '') {
            filteredArray = []
            const copy: any = [...arr.data]
            for (let i = 0; i < total_pages + 1; i++) {
                // Copy item list array to make filtering and other funcs easier to apply
                const slicedArrayPiece = copy.splice(0, 5)
                filteredArray.push(slicedArrayPiece)
            }
        }
        return filteredArray
    }
    arrowClickHandler(keyword: string, actual_page: number, total_pages: number): void {
        if (keyword === 'left' && actual_page > 1) {
            this.setState(this.setPreviousPage)
        } else if (keyword === 'right' && actual_page < total_pages) {
            this.setState(this.setNextPage)
        }
    }
    render() {
        const { prepared_data, actual_page, data, page, per_page, total_items, total_pages, inputId }: any = this.state
        return (
            <div className='MainView'>
                <div className='filterDiv'>
                    <input className='filterInput' placeholder='search by color id' onChange={(e) => {
                        // Check if input is a number
                        if (/^[0-9]*$/.test(e.target.value)) {
                            this.setState({ inputId: e.target.value })
                        } else {
                            e.target.value = inputId
                        }
                    }}></input>
                    <button className='filterButton' onClick={() => this.setState({
                        prepared_data: this.filterForId(data, inputId, total_pages),
                        actual_page: 1,
                        total_pages: this.filterForId(data, inputId, total_pages).length > 1 ? 2 : 1
                    })}><FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />search</button>
                </div>
                <ul className='itemsUl'>
                    {prepared_data[actual_page - 1] !== undefined && prepared_data !== undefined ? prepared_data[actual_page - 1].map((element: any, index: number) => {
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