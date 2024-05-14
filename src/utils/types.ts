export interface ICustomer {
    id: number;
    docType: string;
    docNum: string;
    email: string;
    customerId: string;
    givenName: string;
    familyName1: string;
    phone: string;
}

export interface IProduct {
    _id: number;
    productName: string;
    mbSpeed: number | null;
    gbData: number | null;
    productTypeName: string;
    numeracioTerminal: number;
    soldAt: string;
    customerId: string;
}
