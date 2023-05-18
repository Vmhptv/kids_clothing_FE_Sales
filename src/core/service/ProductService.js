import axios from "axios";

const EMPLOYEE_API_BASE_URL =
  "https://600e68aa3bb1d100179df0b7.mockapi.io/category";

class ProductService {
  getPoroductById(pruductId) {
    return axios.get(EMPLOYEE_API_BASE_URL + "/" + pruductId);
  }
}

export default new ProductService()