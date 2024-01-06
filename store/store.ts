import {configureStore} from '@reduxjs/toolkit'
import basketReduser from "./basket-reduser.ts";

// initial states here
const store = configureStore({
    reducer: {
        basket: basketReduser,
    }
})


export default store