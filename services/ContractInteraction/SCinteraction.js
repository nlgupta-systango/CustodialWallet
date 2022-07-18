const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MyContract = require('../../public/contractABI/MyContract.json');
const dotenv=require('dotenv');
dotenv.config({path: '../../.env'});
const address = process.env.CONTRACT_ADDRESS;
const END_POINT=process.env.INFURA_URL;
const contractInteract = async (privateKey) => {
    const provider = new Provider(privateKey,END_POINT); 
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const myContract = new web3.eth.Contract(
      MyContract.abi,
      address
    //   MyContract.networks[networkId].address
    );

    return myContract;
  }

async function transferFunction(fromAddress,toAddress,privateKey,amount){
    let myContract=await contractInteract(privateKey);
     await myContract.methods.transfer(toAddress,amount).send({
        from:fromAddress
    });
}

async function burnFunction(fromAddress,privateKey,amount){
    let txHash=null;
    let myContract=await contractInteract(privateKey);
     await myContract.methods.burn(amount).send({
        from:fromAddress
    }).on('transactionHash', function(hash){
        txHash= hash;
    })
    .on('receipt', function(receipt){
       // console.log(receipt);
    })
    .on('confirmation', function(confirmationNumber, receipt){
       //console.log(confirmationNumber,receipt);
    })
    .on('error', function(error, receipt) {
       // console.log(error,receipt);
      
    });
    return txHash;
}

async function balanceOfFunction(toAddress,privateKey){
    let myContract=await contractInteract(privateKey);
    let balance= await myContract.methods.balanceOf(toAddress).call();
    return balance;
}

async function totalSupply(privateKey){
    let myContract=await contractInteract(privateKey);
    let totalSupply= await myContract.methods.totalSupply().call();
    return totalSupply;
}

async function mintFunction(fromAddress,toAddress,privateKey,amount){
    let txHash=null;
    let myContract=await contractInteract(privateKey);
     await myContract.methods.mint(toAddress,amount).send({
        from:fromAddress
    }).on('transactionHash', function(hash){
        txHash= hash;
    })
    .on('receipt', function(receipt){
       // console.log(receipt);
    })
    .on('confirmation', function(confirmationNumber, receipt){
       //console.log(confirmationNumber,receipt);
    })
    .on('error', function(error, receipt) {
       // console.log(error,receipt);
      
    });
    return txHash;
}


module.exports={
    contractInteract,
    mintFunction,
    transferFunction,
    burnFunction,
    balanceOfFunction,
    totalSupply


}
  

  