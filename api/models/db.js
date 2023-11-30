const mongoose = require("mongoose");

require("./activity");
require("./category");
require("./currency");
require("./user");

db = process.env.DB_CONNECTION_STRING;

mongoose.connect(db);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection successful.");

  createCategories();
  createCurrencies();
});

/* Categories */
let createCategories = (() => {
  let Category = mongoose.model("Category");

  let categories = [
    {
      _id: "clothes",
      icon: "fa-solid fa-shirt",
      image: "/assets/images/clothes.jpg",
      title: "Clothes",
      color: "#da256a",
      colorName: "fuchsia",
    },
    {
      _id: "education",
      icon: "fa-solid fa-book",
      image: "/assets/images/education.jpg",
      title: "Education",
      color: "#d3b692",
      colorName: "beige",
    },
    {
      _id: "electronics",
      icon: "fa-regular fa-keyboard",
      image: "/assets/images/electronics.jpg",
      title: "Electronics",
      color: "#00807d",
      colorName: "amazon",
    },
    {
      _id: "entertainment",
      icon: "fa-solid fa-ticket",
      image: "/assets/images/entertainment.jpg",
      title: "Entertainment",
      color: "#eba014",
      colorName: "gold",
    },
    {
      _id: "family_friends",
      icon: "fa-solid fa-user-group",
      image: "/assets/images/family.jpg",
      title: "Friends and family",
      color: "#a14eb1",
      colorName: "purple",
    },
    {
      _id: "food_drink",
      icon: "fa-solid fa-pizza-slice",
      image: "/assets/images/food.jpg",
      title: "Food and drink",
      color: "#ffc300",
      colorName: "yellow",
    },
    {
      _id: "groceries",
      icon: "fa-solid fa-carrot",
      image: "/assets/images/groceries.jpg",
      title: "Groceries",
      color: "#ff7d1a",
      colorName: "orange",
    },
    {
      _id: "healthcare",
      icon: "fa-solid fa-prescription-bottle",
      image: "/assets/images/healthcare.jpg",
      title: "Healthcare",
      color: "#e01f22",
      colorName: "red",
    },
    {
      _id: "household",
      icon: "fa-solid fa-couch",
      image: "/assets/images/household.jpg",
      title: "Household",
      color: "#614fb0",
      colorName: "violet",
    },
    {
      _id: "incomes",
      icon: "fa-solid fa-coins",
      image: "/assets/images/incomes.jpg",
      title: "Incomes",
      color: "#3bab46",
      colorName: "green",
    },
    {
      _id: "insurance",
      icon: "fa-solid fa-key",
      image: "/assets/images/insurance.jpg",
      title: "Insurance",
      color: "#005fb3",
      colorName: "navy",
    },
    {
      _id: "miscellaneous",
      icon: "fa-solid fa-note-sticky",
      image: "/assets/images/miscellaneous.jpg",
      title: "Miscellaneous",
      color: "#875645",
      colorName: "brown",
    },
    {
      _id: "personal_care",
      icon: "fa-solid fa-soap",
      image: "/assets/images/personal-care.jpg",
      title: "Personal care",
      color: "#00b37d",
      colorName: "mint",
    },
    {
      _id: "savings",
      icon: "fa-solid fa-seedling",
      image: "/assets/images/savings.jpg",
      title: "Savings",
      color: "#00a2ff",
      colorName: "blue",
    },
    {
      _id: "sport",
      icon: "fa-solid fa-person-skiing",
      image: "/assets/images/sport.jpg",
      title: "Sport",
      color: "#78c639",
      colorName: "jasmine",
    },
    {
      _id: "taxes_fines",
      icon: "fa-solid fa-calendar-days",
      image: "/assets/images/tax.jpg",
      title: "Taxes and fines",
      color: "#b84747",
      colorName: "brick",
    },
    {
      _id: "car_transport",
      icon: "fa-solid fa-car",
      image: "/assets/images/transport.jpg",
      title: "Car and transport",
      color: "#817e7e",
      colorName: "grey",
    },
    {
      _id: "travel",
      icon: "fa-solid fa-umbrella-beach",
      image: "/assets/images/travel.jpg",
      title: "Travel",
      color: "#00cbe6",
      colorName: "teal",
    },
  ];

  categories.forEach((category) => {
    Category.updateOne({
      _id: category._id
    }, category, {
      upsert: true,
    }, ((error, result) => {
      if (error) {
        console.error(error);
      }
    }));
  });
});

let createCurrencies = (() => {
  let Currency = mongoose.model("Currency");
  let currencies = [
    {
      _id: "EUR",
      symbol: "€",
      name: "Euro",
    },
    {
      _id: "USD",
      symbol: "$",
      name: "United States dollar",
    },
    {
      _id: "GBP",
      symbol: "£",
      name: "Pound sterling",
    },
  ];

  currencies.forEach((currency) => {
    Currency.updateOne({
      _id: currency._id
    }, currency, {
      upsert: true,
    }, ((error, result) => {
      if (error) {
        console.error(error);
      }
    }));
  });
});