const jwt = require('jsonwebtoken');

const Models = require('../../models');
const Client = Models.Client;
const jwtTokenGenerator = async (clientEmail) => {
    let clientData = await Client.findOne({ where: { email: clientEmail } });
    let secretKey = clientData.key;
    if (clientData) {
        let token2 = jwt.sign({ "id": clientData.id, "email": clientData.email, "name": clientData.name, "key": secretKey }, secretKey);
        return token2;
    } else {
        return false;
    }
}

module.exports = jwtTokenGenerator;