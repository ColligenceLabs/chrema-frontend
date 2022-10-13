import { Reducer } from 'redux';

export interface StoreTypes {
  CustomizerReducer: Reducer;
  wallet: Reducer;
  wallets: Reducer;
  auth: UserAuthProps;
  message: Reducer;
  nft: Reducer;
}

export interface CollectionDetailResponse {
  network: string;
  category: string[];
  maximum_supply: number;
  status: string;
  _id: string;
  name: string;
  description: string;
  cover_image: string;
  creator_id: {
    _id: string;
    full_name: string;
    image: string;
  };
  optional_images: any[];
  contract_address: string;
  contract_type: string;
  path: string;
  image_link: string;
  logo_image: string;
  createdAt: Date;
  updatedAt: Date;
  fee_percentage: number;
}

export interface CollectionResponse {
  status: number;
  data: {
    headers: {
      x_next_page: number;
      x_page: number;
      x_pages_count: number;
      x_per_page: number;
      x_total_count: number;
    };
    items: [
      {
        _id: string;
        name: string;
        description: string;
        cover_image: string;
        creator_id: {
          full_name: string;
          description: string;
          image: string;
          _id: string;
        };
        path: string;
        image_link: string;
        logo_image: string;
      },
    ];
  };
  message: string;
}

export interface CollectionType {
  item: {
    _id: string;
    name: string;
    description: string;
    cover_image: string;
  };
}

export interface CollectionItemType {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  creator_image: string;
  creator_fullName: string;
  onSale: boolean;
}

export interface NFTResponse {
  status: number;
  data: {
    headers: {
      x_next_page: number;
      x_page: number;
      x_pages_count: number;
      x_per_page: number;
      x_total_count: number;
    };
    items: [
      {
        metadata: {
          name: string;
          description: string;
          image: string;
          alt_url: string;
          content_Type: string;
          cid: string;
          tokenId: string;
          total_minted: string;
          external_url: string;
          attributes: [];
          minted_by: string;
          thumbnail: string;
          creator_icon: string;
          category: string[];
          creator_name: string;
        };
        quantity: number;
        quantity_selling: number;
        price: number;
        quote: string;
        user_quantity_selling: number;
        last_price: number;
        floor_price: number;
        floor_quote: string;
        category: string[];
        onchain: string;
        start_date: Date;
        end_date: Date;
        type: number;
        selling_status: number;
        transfered: number;
        status: string;
        _id: string;
        collection_id: {
          network: string;
          category: string[];
          maximum_supply: number;
          status: string;
          _id: string;
          name: string;
          cover_image: string;
          creator_id: string;
          contract_address: string;
          contract_type: string;
          path: string;
          createdAt: Date;
          updatedAt: Date;
        };
        creator_id: {
          admin_address: string;
          solana_address: string;
          contract_admin_address: string;
          status: string;
          _id: string;
          full_name: string;
          email: string;
          level: string;
          image: string;
          description: string;
          createdAt: Date;
          updatedAt: Date;
        };
        description: string;
        ipfs_link: string;
        createdAt: Date;
        updatedAtDate: Date;
        selling: boolean;
      },
    ];
  };
  message: string;
}

export interface NFTDetailResponse {
  status: number;
  data: {
    header: object;
    metadata: {
      name: string;
      description: string;
      image: string;
      alt_url: string;
      content_Type: string;
      cid: string;
      tokenId: string;
      total_minted: string;
      external_url: string;
      attributes: [];
      minted_by: string;
      thumbnail: string;
      creator_icon: string;
      category: string[];
    };
    quantity: number;
    quantity_selling: number;
    price: number;
    category: string[];
    onchain: string;
    start_date: Date;
    end_date: Date;
    type: number;
    selling_status: number;
    transfered: number;
    status: string;
    _id: string;
    collection_id: {
      network: string;
      category: string[];
      maximum_supply: number;
      status: string;
      _id: string;
      name: string;
      cover_image: string;
      creator_id: string;
      contract_address: string;
      contract_type: string;
      path: string;
      createdAt: Date;
      updatedAt: Date;
    };
    creator_id: {
      admin_address: string;
      solana_address: string;
      contract_admin_address: string;
      status: string;
      _id: string;
      full_name: string;
      email: string;
      level: string;
      image: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    };
    description: string;
    ipfs_link: string;
    createdAt: Date;
    updatedAtDate: Date;
    selling: boolean;
  };
  message: string;
}

export interface NFTType {
  // item: {
  metadata: {
    name: string;
    description: string;
    image: string;
    alt_url: string;
    content_Type: string;
    cid: string;
    tokenId: string;
    total_minted: string;
    external_url: string;
    attributes: [];
    minted_by: string;
    thumbnail: string;
    creator_icon: string;
    creator_name: string;
    category: string[];
  };
  quantity: number;
  quantity_selling: number;
  quote: string;
  price: number;
  user_quantity_selling: number;
  last_price: number;
  floor_quote: string;
  floor_price: number;
  category: string[];
  onchain: string;
  start_date: Date;
  end_date: Date;
  type: number;
  selling_status: number;
  transfered: number;
  status: string;
  _id: string;
  collection_id: {
    network: string;
    category: string[];
    maximum_supply: number;
    status: string;
    _id: string;
    name: string;
    cover_image: string;
    creator_id: string;
    contract_address: string;
    contract_type: string;
    path: string;
    createdAt: Date;
    updatedAt: Date;
  };
  creator_id: {
    admin_address: string;
    solana_address: string;
    contract_admin_address: string;
    status: string;
    _id: string;
    full_name: string;
    email: string;
    level: string;
    image: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  };
  description: string;
  ipfs_link: string;
  createdAt: Date;
  updatedAtDate: Date;
  selling: boolean;
  // };
}

export interface UserAuthProps {
  isLoggedIn: boolean;
  user: {
    infor: {
      id: string;
      full_name: string;
      email: string;
      level: string;
      image: string;
      description: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterForm {
  id?: string;
  full_name?: string | '';
  name?: string | '';
  email: string;
  password: string;
  repeatPassword: string;
  level: string;
  image?: File | string | null | undefined;
  imageSrc?: string | ArrayBuffer | null;
  banner?: File | string | null | undefined;
  bannerSrc?: string | ArrayBuffer | null;
  description: string;
}

export interface RegisterResponse {
  status: number;
  data: {
    _id: string;
    full_name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface TrendingCategoryResponse {
  status: number;
  data: TrendingCategoryItem[];
  message: string;
}

export interface TrendingCategoryItem {
  network: string;
  category: [string];
  maximum_supply: number;
  status: string;
  _id: string;
  name: string;
  cover_image: string;
  creator_id: { _id: string };
  contract_address: string;
  contract_type: string;
  path: string;
  image_link: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  total_volume: number;
  total_volume_usd: number;
  total_volume_krw: number;
  floorPrice: { _id: string; floorPrice: number };
}
