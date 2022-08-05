import Caver from 'caver-js';

export async function signMessage(library, account) {
  try {
    const message = 'Welcome to Taal NFT Marketplace!';
    let sign;

    const isKaikas = library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:';
    if (!isKaikas) {
      sign = await library.provider.request({
        method: 'personal_sign',
        params: [message, account, 'Random text'],
      });
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
