import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const respons = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(respons);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "Oh no! Sth went wrong", err });
  }

  // return res;
};

export default getCoffeeStoresByLocation;
