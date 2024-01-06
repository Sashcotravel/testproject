import s from './basket.module.css'
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateNumberGoods} from "../../../store/basket-reduser.js";
import {useNavigate} from "react-router-dom";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button} from "@mui/material";
import {ICountedProduct, RootState} from "../../utils/interface.ts";



const Basket: React.FC = () => {

    const allGoodsState = useSelector((state: RootState) => state.basket.goods)
    const [allGoods, setAllGoods] = useState<ICountedProduct[]>([])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        setAllGoods(allGoodsState)
    }, [allGoodsState]);

    useEffect(() => {
        const objectCounts: ICountedProduct[] = allGoodsState.reduce((acc: ICountedProduct[], object) => {
            const existingObject = acc.find(item => item.id === object.id);
            if (existingObject) {
                existingObject.count += 1;
            } else {
                acc.push({ ...object, count: object.count });
            }
            return acc;
        }, []);
        setAllGoods(objectCounts)
    }, []);

    const deleteGoods = (id: number) => {
        const updatedGoods = allGoods.filter(item => item.id !== id);
        setAllGoods(updatedGoods);
        dispatch(updateNumberGoods(updatedGoods))
    };

    const addGoods = (id: number) => {
        const updatedGoods = allGoods.map(item =>
            item.id === id ? { ...item, count: item.count + 1 } : item
        );
        dispatch(updateNumberGoods(updatedGoods))
    };

    const minesGoods = (id: number) => {
        const updatedGoods = allGoods.map(item =>
            item.id === id ? { ...item, count: Math.max(item.count - 1, 0) } : item
        );
        dispatch(updateNumberGoods(updatedGoods))
    };

    const order = () => {
        localStorage.setItem('goods', JSON.stringify(allGoods))
        navigate('/register')
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <div className={s.mainBlock}>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell align="right">Product name</StyledTableCell>
                            <StyledTableCell align="right">Price</StyledTableCell>
                            <StyledTableCell align="right">Number</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            allGoods.map((item) => {
                                return (
                                    <StyledTableRow key={item.id}>
                                        <StyledTableCell component="th" scope="row">
                                            <img src={item?.image} alt={item?.title} width={50}/>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{item?.title}</StyledTableCell>
                                        <StyledTableCell align="right">{item?.price} $</StyledTableCell>
                                        <StyledTableCell align="right" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                            <span onClick={() => addGoods(item.id)} className={s.butPlus}>+ </span>
                                            <span className={s.num}>{item?.count}</span>
                                            <span onClick={() => minesGoods(item.id)} className={s.butMines}> -</span>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Button
                                                variant="contained"
                                                onClick={() => deleteGoods(item.id)}
                                                className={s.butEx}
                                            >Exclude</Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <div className={s.divOrder}>
                <Button onClick={order} disabled={allGoodsState.length === 0}
                 variant="contained">To order</Button>
            </div>

        </div>
    );
};

export default Basket;