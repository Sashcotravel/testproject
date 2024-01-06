export interface IProduct {
    title: string;
    category: string;
    id: number;
    price: number;
    description: string;
    image: string;
    rating: {
        count: number;
        rate: number;
    }
}

export interface ICountedProduct extends IProduct {
    count: number;
}

export interface RootState {
    basket: {
        goods: ICountedProduct[];
        allProduct: ICountedProduct[];
        categories: string[]
    };
}

export interface IBasketState {
    num: number;
    allProduct: ICountedProduct[];
    goods: ICountedProduct[];
    categories: string[];
}