import Caver from 'caver-js';

export async function signMessage(provider, account) {
  try {
    const message = 'Welcome to Taal NFT Marketplace!';
    let sign;

    const isKaikas =
      provider.connection.url !== 'metamask' && provider.connection.url !== 'eip-1193:';
    if (!isKaikas) {
      // sign = await provider.request({
      //   method: 'personal_sign',
      //   params: [message, account, 'Random text'],
      // });
      sign = await provider.send('personal_sign', [`${message}`, account]);
    } else {
      const caver = new Caver(window.klaytn);
      const address = window.klaytn.selectedAddress;
      sign = await caver.klay.sign(message, address);
    }

    return sign;
  } catch (e) {
    console.log(e);
    return e;
  }
}
