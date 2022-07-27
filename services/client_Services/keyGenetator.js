

const jwt = require('jsonwebtoken');

const Models = require('../../models');
const Client = Models.ClientTable;
const jwtTokenGenerator = async (clientEmail) => {
    let clientData = await Client.findOne({ where: { email: clientEmail } });
    let secretKey=clientData.key;
    if (clientData) {
       let token2 = jwt.sign({ "id": clientData.id, "email": clientData.email, "name": clientData.name,"key":secretKey},secretKey);
        console.log("valid user Token =", token2)
        return token2;
    }else{
        console.log("client does not exist");
        return false;
    }
}

module.exports=jwtTokenGenerator;