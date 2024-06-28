const express = require('express');
const fs = require('fs');
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, 'connection.json'); // Ensure this path is correct


const app = express();
app.use(express.json());

const walletPath = path.join(process.cwd(), 'wallet');

async function connectToNetwork() {
 const ccpJSON = await fs.promises.readFile(ccpPath, 'utf8');
       
     const ccp = JSON.parse(ccpJSON);
     
    const wallet =  await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true },
            timeout: 60000 // Increase timeout to 60 seconds
        });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mychaincode'); // Use the correct chaincode name
    return contract;
}

app.post('/user', async (req, res) => {
    try {
        const { userName, userDid, userPublicKey } = req.body;
        const contract = await connectToNetwork();
        await contract.submitTransaction('createUser', userName, userDid, userPublicKey);
        res.status(200).send('User has been added');
    } catch (error) {
        console.error(`Failed to create user: ${error}`);
        res.status(500).send(`Failed to create user: ${error}`);
    }
});

app.get('/user/:userDid', async (req, res) => {
    try {
        const { userDid } = req.params;
        const contract = await connectToNetwork();
        const result = await contract.evaluateTransaction('queryUser', userDid);
        res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
        console.error(`Failed to query user: ${error}`);
        res.status(500).send(`Failed to query user: ${error}`);
    }
});

app.post('/credential', async (req, res) => {
    try {
        const { credentialId, issuerDid, credentialType, rootHash, signature, dateOfIssuance } = req.body;
        const contract = await connectToNetwork();
        await contract.submitTransaction('createCredential',credentialId, issuerDid, credentialType, rootHash, signature, dateOfIssuance);
        res.status(200).send('Credential has been added');
    } catch (error) {
        console.error(`Failed to create credential: ${error}`);
        res.status(500).send(`Failed to create credential: ${error}`);
    }
});

app.get('/credential/:credentialId', async (req, res) => {
    try {
        const { credentialId } = req.params;
        const contract = await connectToNetwork();
        const result = await contract.evaluateTransaction('queryCredential', credentialId);
        res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
        console.error(`Failed to query credential: ${error}`);
        res.status(500).send(`Failed to query credential: ${error}`);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
