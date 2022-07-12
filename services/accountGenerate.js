const Web3=require('web3');
var url = 'https://rinkeby.infura.io/v3/a917f10970084ae7bf74ee93daf72b94';
var web3 = new Web3(url);
async function createAccount(){
    let accData=await web3.eth.accounts.create();
    return accData;

}
module.exports=createAccount;