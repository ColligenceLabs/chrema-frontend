import { useMeta } from '@colligence/metaplex-common';
import { useWallet } from '@solana/wallet-adapter-react';

import { useCreatorArts } from './useCreatorArts';
import { ArtworkViewState, Item } from './types';

import { useUserMetadataWithPacks } from './useUserMetadataWithPacks';
import { usePacksBasedOnProvingProcesses } from './usePacksBasedOnProvingProcesses';

export const useItems = ({
  activeKey,
  pubKey,
}: {
  activeKey: ArtworkViewState;
  pubKey: string;
}): Item[] => {
  if (pubKey === undefined || pubKey === '' || pubKey === null) return [];

  const { publicKey } = useWallet();
  const { metadata } = useMeta();
  const createdMetadata = useCreatorArts(publicKey?.toBase58() || '');
  const userMetadataWithPacks = useUserMetadataWithPacks();
  const packsBasedOnProvingProcesses = usePacksBasedOnProvingProcesses();

  let items: Item[];
  if (activeKey === ArtworkViewState.Owned) {
    items = [...userMetadataWithPacks, ...packsBasedOnProvingProcesses];
  } else if (activeKey === ArtworkViewState.Created) {
    items = createdMetadata;
  } else {
    items = metadata;
  }

  let master: string = '';
  items.forEach((item) => {
    if (item.metadata.pubkey === pubKey) {
      master = item.masterEdition.pubkey;
    }
  });

  if (master === undefined || master === '' || master === null) return items;
  console.log('== masterEdition ==>', master);

  return items
    .filter((item) => item.masterEdition === undefined && item.edition.info.parent === master)
    .sort(
      (a: item, b: item) =>
        parseInt(a.edition.info.edition.toString(), 16) -
        parseInt(b.edition.info.edition.toString(), 16),
    );

  // if (activeKey === ArtworkViewState.Owned) {
  //   return [...userMetadataWithPacks, ...packsBasedOnProvingProcesses];
  // }
  //
  // if (activeKey === ArtworkViewState.Created) {
  //   return createdMetadata;
  // }
  //
  // return metadata;
};
