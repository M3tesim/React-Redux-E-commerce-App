import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { totalPrice, productCount, removeFromCart } from "../actions/addToCart";

class Cart extends Component {
 

  render() {
    if (this.props.cart.items.length === 0)
      return (
        <div>
          <h3>Cart</h3>
          <div className="cart-container">
            <p>Cart is empty</p>
            <Link to="/">Go Shopping </Link>
          </div>
        </div>
      );
    const { cart, currencies } = this.props;

 

    return (
      <div className="cart-container">
        <h3>Cart</h3>


<Listitems  cart={cart}  currencies={currencies} dispatch={this.props.dispatch}/>
        <div className="navBar">
          <h4>
            {"Total " +
              currencies.symbol +
              " " +
              Math.round(cart.price[0] * 100) / 100}
          </h4>
          <button className="action-btn">Check Out</button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Cart);

function mapStateToProps({ cart, currencies }) {
  return {
    cart,
    currencies,
  };
}

export class Listitems extends Component {

  state = {
    addedPrice: 0,
  };

  componentDidMount(){
    
    if(this.props.cart.price[0]){ console.log("IAm a bitch")}
    else {this.calculateTotalPrice(); }  }
  

 
  
  calculateTotalPrice = () => {
    const { cart, currencies } = this.props;

    // this function filter the products currency  based on the currency type in store state "currencies"
    const allPrices = cart.items.map((i) =>
      i.prices.filter((c) => c.currency.label === currencies.label)
    );

    // calculating the total price amount of all products
    let total = allPrices
      .map((i) => i[0].amount)
      .reduce((Sum, a) => Sum + a, 0);

    this.totalPriceState(this.state.addedPrice, total);
  };

  totalPriceState = (addedPrice, total) => {
    const { dispatch } = this.props;

    const price = addedPrice + total;

    dispatch(totalPrice(price));
  };

   // thtis will add the price of the prudect that it's number increased  to the total
    changeTotalPrice = (value) => {
    this.setState(() => ({
      addedPrice: this.state.addedPrice + value,
    }));

    this.totalPriceState(value, this.props.cart.price[0]);
  };

  render() {
    const { cart, currencies } = this.props;


      
    return (
      <div>
        {cart.items.map((i, index) => (
          <div key={index}>
            <Item
              product={i}
              cart={cart}
              currencies={currencies}
              dispatch={this.props.dispatch}
              changeTotalPrice={this.changeTotalPrice}
              calculateTotal={this.calculateTotalPrice}
            />
          </div>
        ))}
      </div>
    );
  }
}

export class Item extends Component {

  
  Increment = (value) => {
    const { product } = this.props;

    this.props.changeTotalPrice(value);

    const productcount = { ...this.props.product, count: product.count + 1 };

    this.props.dispatch(productCount(productcount));
  };

  decrement = (value) => {
    const { product } = this.props;

    this.props.changeTotalPrice(-value);

    const productcount = { ...this.props.product, count: product.count - 1 };

    this.props.dispatch(productCount(productcount));
  };

  removeItem = (productID) => {
    //console.log(JSON.stringify(this.props.changeTotalPrice))

    this.props.dispatch(removeFromCart(productID));
  };
  render() {
    const { product, currencies } = this.props;

    const currency = product.prices.filter(
      (c) => c.currency.label === currencies.label
    );

    return (
      <div>
        <hr />
        <div className="cart-info">
          <div>
            <p>
              <strong>{product.brand}</strong>
            </p>
            <h5>{product.name} </h5>
            <h4>
              {currency[0].currency.symbol}
              {currency[0].amount}
              {product.count !== 1 && (
                <span className="countColor" > x {product.count}</span>
              )}
            </h4>

            {product.attributes.map((atr, index) => {
            
              if (atr.name === "Color")
                return (
                  <h5 key={index}>
                    {atr.name}: <span className="colorAttribute" style={{backgroundColor:`${atr.items.value}`}}>{atr.items.id}</span>{" "}
                  </h5>
                );
              else
                return (
                  <h5 key={index}>
                    {atr.name}: {atr.items.id}
                  </h5>
                );
            })}
            <button onClick={() => this.removeItem(product)}> Remove </button>
          </div>

          <div className="left">
            <div className="increament">
              <button
                onClick={() => this.Increment(currency[0].amount)}
                disabled={product.count === 10}>
                +
              </button>

              <span>{product.count} </span>
              <button
                onClick={() => this.decrement(currency[0].amount)}
                disabled={product.count === 1}>
                -
              </button>
            </div>
            <ImgToggle product={product} />
          </div>
        </div>
      </div>
    );
  }
}


export class ImgToggle extends Component {
  state = {
    imgIndex: 0,
    val: false,
  };

  // dynamic toggling of the product imges  using thier index value
  ImgIndexUp = (value) => {
    if (
      0 <= this.state.imgIndex &&
      this.state.imgIndex < this.props.product.gallery.length - 1
    ) {
      this.setState(() => ({
        imgIndex: this.state.imgIndex + value,
      }));
    }
  };

  ImgIndexDown = (value) => {
    if (
      0 < this.state.imgIndex &&
      this.state.imgIndex <= this.props.product.gallery.length
    ) {
      this.setState(() => ({
        imgIndex: this.state.imgIndex + value,
      }));
    }
  };

  render() {
    const { product } = this.props;
    return (
      <div className="img-toggle">
        {this.state.imgIndex === this.props.product.gallery.length - 1 ? (
          ""
        ) : (
          <button onClick={() => this.ImgIndexUp(1)} className="icon-button">
            &and;
          </button>
        )}
        <img
          className="cart-img"
          alt="cart"
          src={product.gallery[this.state.imgIndex]}
        />
        {this.state.imgIndex === 0 ? (
          ""
        ) : (
          <button onClick={() => this.ImgIndexDown(-1)} className="icon-button">
            &or;
          </button>
        )}
      </div>
    );
  }
}
