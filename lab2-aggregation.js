//#1. Average age
db.people2.aggregate([
  {
    $group: {
      _id: null,
      averageAge: { $avg: "$age" },
    },
  },
]);

//#2. Average age by gender
// Expected Result: Female: 42.04, Male: 40.60

db.people2.aggregate([
  {
    $group: {
      _id: "$gender",
      averageAge: { $avg: "$age" },
    },
  },
]);

//#3. Number of people by gender
// Expected Result: Female: 113, Male: 87
db.people2.aggregate([
  {
    $group: {
      _id: "$gender",
      count: { $sum: 1 },
    },
  },
]);

// #4. 3 oldest people
// Expected Result: Phyllis Gray 81, Melissa Banks 79, Walter Bishop 76
db.people2.aggregate([{ $sort: { age: -1 } }, { $limit: 3 }]);

// #5. 5 youngest people, display only their names as one value (first + " " + last) and their ages
// Expected Result: Nicholas Hunter 17, Kenneth Burns 18, Kathy Hayes 19, Edward Hayes 21, Steve Vasquez 21)
db.people2.aggregate([
  { $sort: { age: 1 } },
  { $limit: 5 },
  {
    $project: {
      _id: false,
      name: { $concat: ["$first_name", " ", "$last_name"] },
      age: "$age",
    },
  },
]);

// #6. Average number of children Expected Result: 2.34
db.people2.aggregate([
  {
    $group: {
      _id: null,
      avgChildren: { $avg: { $size: "$children" } },
    },
  },
]);

// #7. Name and age of children in Michigan who are under age ten
// Expected Result: Adam 0, Janice 1, Judith 3, Beverly 4, Antonio 6, Jeremy 7
db.people2.aggregate([
  { $match: { state: "Michigan" } },
  { $unwind: "$children" },
  { $match: { "children.age": { $lt: 10 } } },
  {
    $project: {
      _id: false,
      name: "$children.name",
      age: "$children.age",
    },
  },
]);

// #8. Average age of child by state, sorted with oldest first
// Expected Result: Rhode Island 20, Idaho 20, Louisiana 15.7, Kentucky 13.1, Indiana 12.6, ...
db.people2.aggregate([
  { $unwind: "$children" },
  {
    $group: {
      _id: "$state",
      avgAge: { $avg: "$children.age" },
    },
  },
  { $sort: { avgAge: -1 } },
]);

// #9. Find the total dollar amount of all sales ever. Use the total field.
// Expected Result: 680.92
db.orders.aggregate([
  {
    $group: {
      _id: null,
      totalAll: { $sum: "$total" },
    },
  },
]);

// #10. Find the total dollar amount of sales on 2017-05-22. Use the total field.
// Expected Result: 271.2
db.orders.aggregate([
  { $match: { date: "2017-05-22" } },
  {
    $group: {
      _id: null,
      totalDay: { $sum: "$total" },
    },
  },
]);

// #11. Find the date with the greatest number of orders. Include the date and the number of orders.
// Expected Result: 2017-05-04 3
db.orders.aggregate([
  {
    $group: {
      _id: "$date",
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
  { $limit: 1 },
  {
    $project: {
      date: "$_id",
      orders: "$count",
      _id: 0,
    },
  },
]);

// #12. Find the date with the greatest total sales. Include the date and the dollar amount for that day.
// Expected Result: 2017-05-22 $271.2
db.orders.aggregate([
  {
    $group: {
      _id: "$date",
      totalDay: { $sum: "$total" },
    },
  },
  { $sort: { totalDay: -1 } },
  { $limit: 1 },
  {
    $project: {
      date: "$_id",
      totalDay: "$totalDay",
      _id: 0,
    },
  },
]);

// #13. Find the top three products that have had the greatest number sold. Include product name and number sold.
// Expected Result: Pine Nuts 13, Cheese 8, Top Hat 5
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product",
      totalSold: { $sum: "$items.count" },
    },
  },
  { $sort: { totalSold: -1 } },
  { $limit: 3 },
]);

// #14. Find the top item that has the greatest revenue (number sold * price). Include product name and dollar amount of sales.
// Expected Result: Shoes 197.98

db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product",
      revenue: { $sum: { $multiply: ["$items.count", "$items.price"] } },
    },
  },
  { $sort: { revenue: -1 } },
  { $limit: 1 },
]);
