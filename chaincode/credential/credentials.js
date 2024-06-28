'use strict';

const { Contract } = require('fabric-contract-api');
const stringify  = require('json-stringify-deterministic');

class MyChaincode extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        // Add initial data if needed
        console.info('============= END : Initialize Ledger ===========');
    }

    async createUser(ctx, userName, userDid, userPublicKey) {
        const user = {
            docType: 'user',
            userName,
            userDid,
            userPublicKey,
        };
        await ctx.stub.putState(userDid, Buffer.from(stringify(user)));
    }

    async queryUser(ctx, userDid) {
        const userAsBytes = await ctx.stub.getState(userDid);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userDid} does not exist`);
        }
        return userAsBytes.toString();
    }

    async createCredential(ctx, credentialId, issuerDid, credentialType, rootHash, signature, dateOfIssuance) {
        const credential = {
            docType: 'credential',
            credentialId,
            issuerDid,
            credentialType,
            rootHash,
            signature,
            dateOfIssuance,
        };
        await ctx.stub.putState(credentialId, Buffer.from(stringify(credential)));
    }

    async queryCredential(ctx, credentialId) {
        const credentialAsBytes = await ctx.stub.getState(credentialId);
        if (!credentialAsBytes || credentialAsBytes.length === 0) {
            throw new Error(`${credentialId} does not exist`);
        }
        return credentialAsBytes.toString();
    }
}

module.exports = MyChaincode;

