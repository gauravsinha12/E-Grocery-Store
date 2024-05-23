
import axios from 'axios';

export default async (req, res) => {
  try {
    const response = await axios.put(`https://fastapi-ecommerce-api.onrender.com/products/${req.body.id}`, req.body );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
};
