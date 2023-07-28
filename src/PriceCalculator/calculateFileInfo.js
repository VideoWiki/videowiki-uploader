// File: calculateFileInfo.js (Date: July 25, 2023)

import * as ethers from 'ethers';
import abi from './abi.json';

// Function to calculate file information
export async function calculateFileInfo(file, ttl) {
    const size = file.size;
    const chunks = Math.ceil(size / 4096);
    let depth = Math.ceil(Math.log2(chunks));
    if (depth < 20) depth = 20;
  
    const provider = new ethers.providers.JsonRpcProvider('https://goerli.mooo.com/', 5);
    const contract = new ethers.Contract('0x621e455c4a139f5c4e4a8122ce55dc21630769e4', abi, provider);
  
    const pricePerBlock = await contract.lastPrice();
    const blockTime = 15;
    const postageStampChunks = 2 ** depth;
    const initialBalancePerChunk = pricePerBlock.mul(ttl).div(blockTime);
    const totalAmount = initialBalancePerChunk.mul(postageStampChunks);
  
    return {
      name: file.name,
      size: size,
      sizeKB: size / 1024,
      sizeMB: size / 1024 / 1024,
      type: file.type,
      chunks: chunks,
      depth: depth,
      ttl: ttl,
      ttlMinutes: ttl / 60,
      ttlHours: ttl / 60 / 60,
      ttlDays: ttl / 60 / 60 / 24,
      ttlYears: ttl / 60 / 60 / 24 / 365,
      initialBalancePerChunk: initialBalancePerChunk.toString(),
      totalAmount: ethers.utils.formatUnits(totalAmount, 16),
      totalAmountPLUR: totalAmount.toString(),
    };
}

