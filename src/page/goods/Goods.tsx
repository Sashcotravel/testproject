import React, {useEffect, useState} from 'react';
import s from './goods.module.css'
import {useParams} from "react-router-dom";
import {addNumberGoods} from "../../../store/basket-reduser.js";
import {useDispatch} from "react-redux";
import {Button} from "@mui/material";
import {ICountedProduct} from "../../utils/interface.ts";


const Goods: React.FC = () => {

    const { id} = useParams();

    const [goods, setGoods] = useState<ICountedProduct>()
    const [addedName, setAddedName] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        fetch('https://fakestoreapi.com/products/' + id)
            .then(res=>res.json())
            .then( json=> setGoods(json))
            .catch(err => {
                console.log(err)
                const responseMessage = { message: 'Something went wrong!' };
                const status = 500;
                return new Response(JSON.stringify(responseMessage), { status: status } as ResponseInit);
            })
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setAddedName(false)
        }, 3000)
    }, [addedName]);

    const addGoods = () => {
        dispatch(addNumberGoods(goods))
        setAddedName(true)
    }

    return (
        <div className={s.mainDiv}>

            { addedName && <div className={s.added} id='addedName'>Good {goods?.title} added</div>}

            <div className={s.divBox1}>
                <img src={goods?.image} alt={goods?.title} />
            </div>

            <div className={s.divBox2}>
                <h1>{goods?.title}</h1>
                <p className={s.cat}>Category - {goods?.category}</p>
                <p className={s.cat}>Rate {goods?.rating?.rate}</p>
                <p>{goods?.description}</p>
                <p className={s.cat}>Prise - {goods?.price} $</p>
                <Button variant="contained" size="large" onClick={addGoods}>
                    Buy
                </Button>
            </div>

        </div>
    );
};

export default Goods;