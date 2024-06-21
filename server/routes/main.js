const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Importing Modules
const Order = require("../models/Order");
const Product = require("../models/Product");
const Campaign = require("../models/Campaign");
const Creator = require("../models/Creator");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Payment = require("../models/Payment");
const brand = require("../models/Brand");

const Bid = require("../models/Bid");
const Withdraw = require("../models/Withdraw");

//Controllers
const fundsController = require("../controllers/fund");
const chatController = require("../controllers/chat");
const withdrawController = require("../controllers/withdraw");

// Test route
router.get("/test", (req, res) => {
  res.send("Working");
});

// Orders
// Add a new order
router.post("/add_order", async (req, res) => {
  const branduser = req.body.branduser;
  const confirmed_creator = req.body.confirmed_creator
  const campaignId = req.body.campaign

  res.setHeader("Content-Type", "application/json");
  try {
    const user = await User.findOne({ userId: branduser });
    if (!user) {
      return res.status(404).json("User not Found");
    }
    user.funds.amount -= parseInt(req.body.price * 1.03);
    await user.save();

    // const newOrder = new Order({
    //   ...req.body,
    //   date: new Date()
    // });

    const newOrder = new Order({
      campaign: req.body.campaign,
      price: req.body.price,
      status: req.body.status,
      demoImage: req.body.demoImage,
      demoVideo: req.body.demoVideo,
      branduser: req.body.branduser,
      creatoruser: req.body.creatoruser,
      date: new Date()
    });

    const campaign = await Campaign.findOne({ _id: campaignId });
    if (!campaign) {
      return res.status(404).json("campaign not Found");
    }
    campaign.takenBy = confirmed_creator
    await campaign.save();

    newOrder.save(err => {
      if (err) {
        console.log(err);
        res.status(400).json(`Error: ${err}`);
      } else res.status(200).send("created a new order");
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(`Error: ${err}`);
  }
});

// Get all the orders
router.get("/get_orders", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Order.find({})
    .populate({
      path: "campaign",
      model: "campaign",
      populate: [
        {
          path: "product",
          model: "product"
        }
      ]
    })
    .then(p => {
      console.log(p);
      res.status(200).json(p);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    });
});

// Get all the orders by brand user
router.get("/get_orders/branduser/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Order.find({ branduser: req.params.userId })
    .populate({
      path: "campaign",
      model: "campaign",
      populate: [
        {
          path: "product",
          model: "product"
        }
      ]
    })
    .then(p => {
      console.log(p);
      res.status(200).json(p);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    });
});

// Get all the orders by creator user
router.get("/get_orders/creatoruser/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Order.find({ creatoruser: req.params.userId })
    .populate({
      path: "campaign",
      model: "campaign",
      populate: [
        {
          path: "product",
          model: "product"
        }
      ]
    })
    .then(p => {
      console.log('order===', p);
      res.status(200).json(p);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    });
});

router.get(
  "/get_orders_by_status/branduser/:userId/:status",
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    Order.find(
      {
        branduser: req.params.userId,
        status: parseInt(req.params.status)
      },
      (err, orders) => {
        if (err) res.status(400).json(`Error: ${err}`);
        else res.status(200).json(orders);
      }
    );
  }
);

router.get(
  "/get_orders_by_status/creatoruser/:userId/:status",
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    Order.find(
      {
        creatoruser: req.params.userId,
        status: parseInt(req.params.status)
      },
      (err, orders) => {
        if (err) res.status(400).json(`Error: ${err}`);
        else res.status(200).json(orders);
      }
    );
  }
);
// Get all the orders based on their status and type
// router.get("/get_orders_by_status/:status", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   Order.find(
//     {
//       status: parseInt(req.params.status),
//     },
//     (err, orders) => {
//       if (err) res.status(400).json(`Error: ${err}`);
//       else res.status(200).json(orders);
//     }
//   );
// });

// Delete an order
router.delete("/delete_order/:orderId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Order.deleteOne({ _id: req.params.orderId }, err => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send("Deleted one order successfully!");
  });
});

// Get a single order
router.get("/get_specific_order/:orderId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Order.findOne({ _id: req.params.orderId }, (err, order) => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send(order);
  });
});

// Patch an order
router.patch("/edit_order/:orderId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  // console.log(req.body);
  console.log("request ====>>>", req.body.status);
  try {
    const order = await Order.findOne({ _id: req.params.orderId });
    const creator = await User.findOne({ userId: order.creatoruser });
    if (!creator) {
      return res.status(404).json("User not Found");
    }
    if (req.body.status === 1) {
      creator.funds.amount += parseInt(order.price);
    }
    console.log(typeof creator.funds.amount);
    await creator.save();
    Order.updateOne(
      { _id: req.params.orderId },
      {
        $set: req.body
      },
      err => {
        if (err) res.status(400).json(`Error: ${err}`);
        else res.status(200).send("Edited an order");
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(`Error: ${err}`);
  }
});

// Brands
// Add a new brand

router.post("/add_brand", (req, res) => {
  console.log(req.body);

  res.setHeader("Content-Type", "application/json");

  const newBrand = new brand({
    ...req.body
  });

  newBrand.save(err => {
    console.log(err);
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send("created a new brand");
  });
});

// get user  brands

router.get("/get_brands/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  brand.find({ userId: req.params.userId }, (err, brands) => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).json(brands);
  });
});

// Products
// Add a new product
router.post("/add_product", (req, res) => {
  console.log(req.body);

  res.setHeader("Content-Type", "application/json");

  const newProduct = new Product({
    ...req.body
  });

  newProduct.save(err => {
    console.log(err);
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send("created a new product");
  });
});

// Get all the products
router.get("/get_products/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Product.find({ userId: req.params.userId }, (err, products) => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).json(products);
  });
});

// Get all the orders based on their type
// router.get("/get_orders_by_type/:userId/:type", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   Order.find(
//     { userId: req.params.userId, type: parseInt(req.params.type) },
//     (err, orders) => {
//       if (err) res.status(400).json(`Error: ${err}`);
//       else {
//         console.log(orders);
//         res.status(200).json(orders);
//       }
//     }
//   );
// });

// Get all the orders based on their status and type
// router.get("/get_orders_by_status/:userId/:status/:type", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   Order.find(
//     {
//       userId: req.params.userId,
//       status: parseInt(req.params.status),
//       type: parseInt(req.params.type),
//     },
//     (err, orders) => {
//       if (err) res.status(400).json(`Error: ${err}`);
//       else res.status(200).json(orders);
//     }
//   );
// });

// Delete a product
router.delete("/delete_product/:productId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Product.deleteOne(
    { _id: req.params.productId, userId: req.params.userId },
    err => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send("Deleted one product successfully!");
    }
  );
});

// Get a single product
router.get("/get_product_by_id/:productId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Product.findOne(
    { _id: req.params.productId, userId: req.params.userId },
    (err, order) => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send(order);
    }
  );
});

// Campaigns
// Add a new campaign
router.post("/add_campaign", (req, res) => {
  console.log(req.body);

  res.setHeader("Content-Type", "application/json");

  const newCampaign = new Campaign({
    ...req.body
  });

  newCampaign.save(err => {
    if (err) {
      res.status(400).json(`Error: ${err}`);
    } else res.status(200).send("created a new campaign");
  });
});

router.get("/get_all_campaigns", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Campaign.find()
    .populate("product")
    .then(p => res.status(200).json(p))
    .catch(error => res.status(400).json(error));
});
// Get all the campaigns of a user
router.get("/get_campaigns/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Campaign.find({ userId: req.params.userId }, (err, products) => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).json(products);
  }).populate("brand", "name");
});

// Delete a campaign
router.delete("/delete_campaign/:campaignId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Campaign.deleteOne(
    { _id: req.params.campaignId, userId: req.params.userId },
    err => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send("Deleted one campaign successfully!");
    }
  );
});

// Get a single campaign
router.get("/get_campaign_by_id/:campaignId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Campaign.findOne({ _id: req.params.campaignId, userId: req.params.userId })
    .populate("product")
    .then(order => res.status(200).send(order))
    .catch(error => res.status(400).json(`Error: ${err}`));
});

//Patch a campaign
router.patch("/edit_campaign/:orderId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Campaign.updateOne(
    { _id: req.params.orderId, userId: req.params.userId },
    {
      $set: req.body
    },
    err => {
      if (err) {
        console.log(err);
        res.status(400).json(`Error: ${err}`);
      } else res.status(200).send("Edited a campaign");
    }
  );
});

module.exports = router;

// User
// Add a new user
router.post("/add_creator", (req, res) => {
  console.log(req.body);

  res.setHeader("Content-Type", "application/json");

  const newCreator = new Creator({
    ...req.body
  });

  newCreator.save(err => {
    console.log(err);
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send("added a new creator");
  });
});

router.post("/add_payment", (req, res) => {
  console.log(req.body);

  res.setHeader("Content-Type", "application/json");

  const newPayment = new Payment({
    ...req.body
  });

  newPayment.save(err => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send("added a new payment");
  });
});

// Get all the campaigns of a user
router.get("/get_payment_details/:email", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Payment.find({ email: req.params.email }, (err, payment_info) => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).json(payment_info);
  });
});

//Update by ID Method
router.patch("/update_payment/:email", async (req, res) => {
  try {
    // const {name,street,city,zip,country} = req.body;

    const result = await Payment.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          name: req.body.name,
          street: req.body.street,
          city: req.body.city,
          zip: req.body.zip,
          country: req.body.country
        }
      },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }
        res.send(doc);
      }
    );

    // const result = await Payment.findByEmailAndUpdate(
    //    {
    //      "name":name,
    //      "street":street,
    //      "city":city,
    //      "zip":zip,
    //      "country":country
    //    }
    // )

    // res.send(result)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/get_all_creators", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Creator.find()
    .then(p => res.status(200).json(p))
    .catch(error => res.status(400).json(error));
});

// Delete a campaign
router.delete("/delete_creator/:campaignId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Creator.deleteOne(
    { _id: req.params.campaignId, userId: req.params.userId },
    err => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send("Deleted one creator successfully!");
    }
  );
});

// Get a single creator
router.get("/get_creator_by_id/:userId", async (req, res) => {
  console.log(req.params.userId);
  res.setHeader("Content-Type", "application/json");
  Creator.findOne({ userId: req.params.userId })
    .then(order => {
      console.log(order);
      res.status(200).json(order);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(`Error: ${error}`);
    });
});

//Patch a campaign
router.patch("/edit_creator/:orderId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Creator.updateOne(
    { _id: req.params.orderId, userId: req.params.userId },
    {
      $set: req.body
    },
    err => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send("Edited a campaign");
    }
  );
});

module.exports = router;

// Users
// Add a new user
router.post("/add_user", (req, res) => {
  console.log(req.body);
  const { userId, userType, name, email, phoneNumber } = req.body;

  res.setHeader("Content-Type", "application/json");

  User.findOne({ userId }, (err, user) => {
    console.log(err);
    console.log(user);
    if (err) res.status(400).json(`Error: ${err}`);
    if (!user) {
      const newUser = new User({
        name,
        email,
        userId,
        userType,
        phoneNumber,
        funds: {
          amount: 0,
          currency: "USD"
        }
      });
      newUser.save((err, results) => {
        console.log(err);
        console.log(results);
        if (err) res.status(400).json(`Error: ${err}`);
        else res.status(200).send(results);
      });
    } else {
      res.status(200).json(user);
    }
  });
});

// Users
// Add a new user
router.post("/add_wallet", (req, res) => {
  const newWallet = new Wallet({
    email: req.body.email,
    funds: {
      amount: req.body.funds.amount,
      currency: "USD"
    }
  });
  newWallet.save((err, results) => {
    console.log(results);
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send(results);
  });
});

// Get a single order
router.get("/get_wallet/:email", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Wallet.find({ email: req.params.email }, (err, wallet) => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send(wallet);
  });
});

//Get All Users
router.get("/get_all_users", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).json(`Error: ${error}`));
});

//Get All Users
router.get("/get_all_disbaled_users/:disabled", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  User.find({ disabled: req.params.disabled })
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).json(`Error: ${error}`));
});



// Get a single user
router.get("/get_user_by_id/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  User.findOne({ userId: req.params.userId })
    .then(user => res.status(200).send(user))
    .catch(error => res.status(400).json(`Error: ${err}`));
});

// Get a single user
router.get("/get_protifolio_by_id/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Creator.findOne({ userId: req.params.userId })
    .then(user => res.status(200).send(user))
    .catch(error => res.status(400).json(`Error: ${err}`));
});

//Patch a user
router.patch("/edit_user/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  User.updateOne(
    { userId: req.params.userId },
    {
      $set: req.body
    },
    err => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send("Edited a user");
    }
  );
});

//Delete User
router.delete("/delete_user/:userId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  User.deleteOne({ userId: req.params.userId }, err => {
    if (err) res.status(400).json(`Error: ${err}`);
    else res.status(200).send("Edited a user");
  });
});

// Add a new bid
router.post("/add_bid", (req, res) => {
  // console.log(req.body);
  const { campaign, creator, creatorLevel, price } = req.body;

  res.setHeader("Content-Type", "application/json");

  Bid.findOne({ campaign }, (err, bid) => {
    // console.log(err);
    // console.log(bid);
    if (err) res.status(400).json(`Error: ${err}`);
    if (!bid) {
      const newBid = new Bid({
        campaign,
        creators: [
          {
            creator,
            creatorLevel,
            price
          }
        ],
        winningBid: {}
      });
      newBid.save((err, results) => {
        console.log(err);
        console.log(results);
        if (err) res.status(400).json(`Error: ${err}`);
        else res.status(200).send(results);
      });
    } else {
      let index = bid.creators.findIndex(c => c.creator == creator);

      if (index !== -1) {
        bid.creators[index] = {
          creator,
          creatorLevel,
          price
        };
      } else {
        bid.creators.push({ creator, creatorLevel, price });
      }

      console.log(bid.creators);

      bid.save((err, results) => {
        // console.log(err);
        // console.log(results);
        if (err) res.status(400).json(`Error: ${err}`);
        else res.status(200).send(results);
      });
    }
  });
});
module.exports = router;

router.get("/get_all_bids", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Bid.find()
    .then(p => res.status(200).json(p))
    .catch(error => res.status(400).json(error));
});

router.get("/get_bid_by_campaign/:campaignId", async (req, res) => {
  console.log(req.params.campaignId);
  res.setHeader("Content-Type", "application/json");
  Bid.findOne({ campaign: req.params.campaignId })
    .populate("campaign creators.creator")
    .then(p => {
      console.log(p);
      res.status(200).json(p);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    });
});

router.get("/get_bids_by_creator/:creatorId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Bid.find({ creators: { $elemMatch: { creator: req.params.creatorId } } })
    .then(p => res.status(200).json(p))
    .catch(error => res.status(400).json(error));
});

router.patch("/edit_bid/:bidId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Bid.updateOne(
    { _id: req.params.bidId },
    {
      $set: {
        winningBid: req.body.winningBid
      }
    },
    err => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send("Edited a bid");
    }
  );
});

// Delete a bid
router.delete("/delete_bid/:bidId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  Bid.deleteOne(
    { _id: req.params.campaignId, userId: req.params.userId },
    err => {
      if (err) res.status(400).json(`Error: ${err}`);
      else res.status(200).send("Deleted one creator successfully!");
    }
  );
});

//Funds
router.post("/create-payment-intent", fundsController.createPaymentIntent);
router.post("/addFunds", fundsController.addFunds);
router.post("/addFundsFPX", fundsController.addFundsFPX);
router.patch("/change-currency", fundsController.changeCurrency);
router.patch("/change-address", fundsController.changeAddress);
router.post("/convert-currency", fundsController.convertCurrency);
router.post("/choose-creator", fundsController.chooseCreator);
// router.post("/buyProduct", fundsController.buyProduct);
// router.get("/fetchCountries", countryController.fetchCountries);

//Chat
router.post("/addMessage/:id", chatController.addMessage);
router.get("/getContacts/:query", chatController.getContacts);
router.get("/getThreads/:id", chatController.getThreads);
router.get("/getThread/:id/:threadKey", chatController.getThread);
router.post("/markThreadAsSeen/:threadId", chatController.markThreadAsSeen);
router.get("/getParticipants/:id/:threadKey", chatController.getParticipants);

//Withdraw Requests
router.patch("/withdraw-funds/:creatorId", withdrawController.withdrawFunds);
router.get("/get-all-withdrawals", withdrawController.getAllWithdrawRequests);
router.get(
  "/get-withdrawals-by-user/:creatorId",
  withdrawController.getWithdrawRequestsByUser
);
router.get(
  "/get-withdrawals-by-id/:withdrawalId",
  withdrawController.getWithdrawRequestById
);

module.exports = router;
