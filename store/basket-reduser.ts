import {createSlice} from "@reduxjs/toolkit";
import {IBasketState} from "../src/utils/interface.ts";




let initialState: IBasketState = {
    num: 0,
    allProduct: [],
    goods: [],
    categories: []
}


const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addAllProduct: (state, action) => {
            state.allProduct = action.payload
        },
        addNumberGoods: (state, action) => {
            state.goods.push(action.payload)
        },
        updateNumberGoods: (state, action) => {
            state.goods = action.payload
        },
        addCategories: (state, action) => {
            state.categories = action.payload
        },
    }
})

export default basketSlice.reducer

export const {
    addAllProduct,
    addNumberGoods,
    addCategories,
    updateNumberGoods
} = basketSlice.actions