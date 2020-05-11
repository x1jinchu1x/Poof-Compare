import React, {Component} from 'react';
import './styles.css';
import ReactTooltip from 'react-tooltip';
import {store} from '../../index.js';

const axios = require('axios');


async function setWatchList(item){

    try{
      let response = await axios({
        method: 'post',
        url: "https://us-central1-poofapibackend.cloudfunctions.net/watchList-setWatchlistItem",
        headers: {
          "Authorization": "Bearer b99d951c8ffb64135751b3d423badeafac9cfe1f54799c784619974c29e277ec",
          "Accept" : "application/json",
          "Content-Type" : "application/json",
        },
        data: {
            "userId" : store.getState().item.storeUserId,
            "title" : item.title,
            "itemUrl" : item.link,
            "price" : item.price,            
        },
      })
    
      let confirmation = await response.data;
      console.log("Successfully added item to firebase watchlist!: ", confirmation, item.title);
    }
  
    catch(err){
      console.log(err, "Unable to set items into watchlist");
    }
}


class Product extends Component{
    constructor(props){
        super(props);
    }

    handleWatch(watchFxn, product) {
        //Assigns item to cache watchlist
        watchFxn(product);

        //If user is signed in with email or phone#, item is added to their watchlist on the firebase database as well
        if (store.getState().item.storeUserId !== ""){
            setWatchList(product);
          };
    }

    render(){

        return(

        <div className="col-sm-6 col-md-3">
            <div className={"product " + (this.props.item.compare ? "compare" : "")} >
                <img style={{width: "100%", height: "400px"}} src={this.props.item.image} alt={this.props.item.title} />
                <div className="image_overlay"/>
                <div className="view_details" onClick={() => this.props.compare(this.props.item)}>
                {this.props.item.compare ? "Remove" : "Compare"}
                </div>
                <div className="stats">
                    <div className="stats-container">
                        <span className="product_price">{this.props.item.price}</span>
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "center", marginLeft: "60px"}}>
                            <p data-tip={(this.props.item.watch? "Remove from watchlist" : "Add to watchlist")} ><i className="material-icons watchButton" style={{color: (this.props.item.watch ? "darkgoldenrod" : "black")}} onClick={() => this.handleWatch(this.props.watch, this.props.item)}>remove_red_eye</i></p>
                            <ReactTooltip />
                        </div>
                        <div className="name-container" style={{display: "flex", textAlign: "center", marginLeft: "50px"}}>
                            <span className="product_name" style={{position: "relative"}}>{this.props.item.title}</span>
                        </div>
                        {/* Previous line to allow for short details about the product */}
                        {/* <p style={{position:"relative", top: "10px"}}>{item.short}</p> */}
                    </div>
                </div>
            </div>
        </div>
        );
    }
} 
    

export default Product
