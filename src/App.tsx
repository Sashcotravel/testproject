import './app.scss'
import Navbar from "./components/navbar/Navbar.tsx";
import { Route, Routes } from "react-router-dom";
import React, {Suspense, useEffect} from 'react';
import {useDispatch} from "react-redux";
import Basket from "./page/basket/Basket.tsx";
import Main from "./page/main/Main.tsx";
import {addAllProduct, addCategories} from "../store/basket-reduser.js";
import Goods from "./page/goods/Goods.tsx";
import Register from "./page/register/Register.tsx";
import * as emailjs from "@emailjs/browser";
import {ICountedProduct, IProduct} from "./utils/interface.ts";







const App: React.FC = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const res = await fetch('https://fakestoreapi.com/products');
                const json: IProduct[] = await res.json();

                const objectCounts: ICountedProduct[] = json.reduce((acc: ICountedProduct[], object) => {
                    const existingObject  = acc.find((item: IProduct) => item.id === object.id);
                    if (existingObject) {
                        existingObject.count += 1;
                    } else {
                        acc.push({ ...object, count: 1 });
                    }
                    return acc;
                }, []);

                dispatch(addAllProduct(objectCounts));
            } catch (err) {
                console.error(err);
                const responseMessage = { message: 'Something went wrong!' };
                const status = 500;
                return new Response(JSON.stringify(responseMessage), { status: status } as ResponseInit);
            }
        };
        fetchGoods()

        const fetchCategory = async () => {
            try {
                const res = await fetch('https://fakestoreapi.com/products/categories');
                const json: String[] = await res.json();
                dispatch(addCategories(json));
            } catch (err) {
                console.error(err);
                const responseMessage = { message: 'Something went wrong!' };
                const status = 500;
                return new Response(JSON.stringify(responseMessage), { status: status } as ResponseInit);
            }
        };
        fetchCategory()


        emailjs.init("3Mc-73LbFRIjdNMkx");
    }, []);

    return (
        <div>
            <section>
                <Navbar/>
            </section>

            <Suspense fallback={<div>Loading ...</div>}>
                <Routes>
                    <Route path="/" element={<Main />}/>
                    <Route path="/goods/:id" element={<Goods />}/>
                    <Route path="/basket" element={<Basket />}/>
                    <Route path="/register" element={<Register />}/>
                </Routes>
            </Suspense>
        </div>
    )
};

export default App;
