const getNftPrice = (
  price: number,
  floor_price: number,
  user_quantity_selling: number,
  quantity_selling: number,
  last_price: number,
) => {
  if (quantity_selling === 0 && user_quantity_selling === 0) return last_price;
  if (user_quantity_selling !== 0) {
    if (price <= floor_price) return price;
    else return floor_price;
  } else {
    return price;
  }
};

export default getNftPrice;
