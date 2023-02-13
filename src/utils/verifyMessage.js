import { ethers } from 'ethers';

export async function verifyMessage(library, sign, signedMessage) {
  const message = 'Welcome to Taal NFT Marketplace!';
  try {
    const signer = ethers.utils.verifyMessage(message, signedMessage);
    console.log('==== verifyMessage ===', signer);
    return signer;
  } catch (e) {
    console.log(e);
    return e;
  }
}
