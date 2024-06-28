/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const myChaincode = require('./credentials.js');

module.exports.MyChaincode = myChaincode;
module.exports.contracts = [myChaincode];
