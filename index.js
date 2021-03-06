const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const app = express();

let order_id_variable;
const razorpay = new Razorpay({
  key_id: "rzp_test_dt6scHVUP4GZIq",
  key_secret: "d49XvgaVffUzRrNEupPj0HWU",
});

app.set("views", "views");
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // console.log("get-/ from server");
  res.render("index.ejs");
}); 

app.post("/order", (req, res) => {
  // console.log("post- /orders from server");
  let options = {
    amount: 500 * 100,
    currency: "INR",
    receipt: "12345678",
  };

  razorpay.orders.create(options, (err, order) => {
    order_id_variable = order.id;
    console.log(order);

    res.json(order);
  });
});

app.post("/is-order-complete", (req, res) => {
  razorpay.payments
    .fetch(req.body.razorpay_payment_id)
    .then((paymentDocument) => {
      console.log(paymentDocument);
      if (paymentDocument.status == "captured") {
        res.send("payment successful");
      } else {
        res.redirect("./views/index.ejs");
      }
    });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
