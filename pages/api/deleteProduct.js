
import axios from 'axios';

export default async (req, res) => {
  try {
    const response2 = await axios.delete(`https://fastapi-ecommerce-api.onrender.com/products/${req?.query?.id}` );
    res.json(response2.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
};
