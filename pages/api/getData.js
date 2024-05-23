
import axios from 'axios';

export default async (req, res) => {
  try {
    const {min_price, max_price, limit, offset } = req.query
    const response = await axios.get(`https://fastapi-ecommerce-api.onrender.com/products/all?limit=${limit}&offset=${offset}&min_price=${min_price}&max_price=${max_price}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
};
