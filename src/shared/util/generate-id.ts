import ObjectID from "bson-objectid";

export default () =>
  `${new ObjectID(
    new Date().getTime() + Math.floor(Math.random() * (1000 - 1)) + 1
  )}`;
