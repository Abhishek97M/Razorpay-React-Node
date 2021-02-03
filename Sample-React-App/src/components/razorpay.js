import React, { Component } from 'react'
import Axios from 'axios'

class RazorPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderID: ""
        }
    }
    RequestOrderPayment = () => {
        let amntTxt = document.getElementById('amount').value
        //Getting the Order ID
        Axios.post('--your cloud function address for creating order with razorpay--', { amount: amntTxt, receipt: "Abhishek-sample-attendio-5266" })
            .then(response => {
                this.setState({
                    orderID: response.data.id,         
                })
                var options = {
                    "key_id": "--your key id---",
                    "key_secret": "--your key secret--",
                    "amount": amntTxt,
                    "currency": "INR",
                    "name": "ATTENDiO-ASKAI",
                    "description": "Package type",
                    "image":"a-letter-logo-png-84.svg",
                    "order_id": this.state.orderID,
                    handler: function (response) {
                        alert(response.razorpay_payment_id);
                        //Verifying the data
                        Axios.post('--your cloud function address for payment verification with razorpay--', { razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id,razorpay_signature:response.razorpay_signature })
                        .then((response) => {
                            console.log(response);
                        }, (error) => {
                            console.log(error);
                          });
                    },
                    "prefill": {
                        "name": "",
                        "email": "",
                        "contact": "",
                    },
                    "notes": {
                        "address": "note value",
                    },
                    "theme": {
                        "color": "#F37254"
                    }
                };
                var rzp1 = new window.Razorpay(options)
                rzp1.open();
            })

    }
    render() {
        return (
            <div>
                <input type="number" className="" id="amount" placeholder="Enter Amount To Be Paid"></input>
                <button id="rzp-button1" onClick={() => this.RequestOrderPayment()}>Pay</button>
            </div>
        )
    }
}
export default RazorPanel;
