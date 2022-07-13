const Web3=require('web3');
const dotenv=require('dotenv');
dotenv.config();
var url = process.env.INFURA_URL;
var web3 = new Web3(url);
async function createAccount(){
    let accData=await web3.eth.accounts.create();
    return accData;

}
module.exports=createAccount;