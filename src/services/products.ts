import instance from "../utils/axios.ts";
import {IProduct} from "../utils/types.ts";

export const getCustomerProducts = async (customerId: string) => {
  try {
    const { data } = await instance.get(`/products?customerId=${customerId}`);
    return data as IProduct[];
  } catch (error) {
    throw new Error("Error al obtenir els productes");
  }
};
