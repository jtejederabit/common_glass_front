import instance from "../utils/axios.ts";
import {ICustomer} from "../utils/types.ts";

export const getCustomers = async () => {
  try {
    const { data } = await instance.get("/customers");
    return data as ICustomer[];
  } catch (error) {
    return [];
  }
};
