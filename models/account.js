const invodb = require("invodb");

let acc = invodb.collection("account");
if(!acc.exist()) acc.create();

module.exports = acc;