import React, {FormEvent, useEffect, useState} from 'react';
import s from './register.module.css'
import * as emailjs from "@emailjs/browser";
import {useNavigate} from "react-router-dom";
import {updateNumberGoods} from "../../../store/basket-reduser.js";
import {useDispatch} from "react-redux";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button, TextField} from "@mui/material";
import {ICountedProduct} from "../../utils/interface.ts";


const Register = () => {

    const [order, setOrder] = useState<ICountedProduct[]>([])
    const [formData, setFormData] = useState({
        email: '', name: '', phone: ''
    });
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const localStorageData = localStorage.getItem('goods');
        if (localStorageData) {
            const parsedData = JSON.parse(localStorageData) as ICountedProduct[];
            setOrder(parsedData);
        }
    }, []);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\+\d{12}$/;
        return phoneRegex.test(phone);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isEmailValid = validateEmail(formData.email);
        const isPhoneValid = validatePhone(formData.phone);

        if (isEmailValid && isPhoneValid) {
            console.log(order, formData)
            const addedNameElement = document.getElementById('addedName');
            if (addedNameElement) {
                addedNameElement.style.display = 'flex'
            }
            setTimeout(() => {
                dispatch(updateNumberGoods([]))
                localStorage.removeItem('goods')
                navigate('/')
            }, 3000)
            const templateParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                order: `${order.map((item, index) => `${index+1}) Назва товару: ` + item.title + ', ціна: ' + item.price + ', кількість: ' + item.count + ', разом: ' +
                    item.count * item.price + `
            `)}`,
            }
            emailjs.send('service_zdhdrx8', 'template_va22k5r', templateParams, '3Mc-73LbFRIjdNMkx');
        }
        else {
            const addedEmailElement = document.getElementById('phone');
            const addedPhoneElement = document.getElementById('email');
            if(!isEmailValid && !isPhoneValid){
                if (addedPhoneElement && addedEmailElement) {
                    addedPhoneElement.style.border = '2px solid red'
                    addedEmailElement.style.border = '2px solid red'
                }
            }
            if(!isEmailValid){
                if (addedEmailElement) {
                    addedEmailElement.style.border = '2px solid red'
                }
            } else if(!isPhoneValid){
                if (addedPhoneElement) {
                    addedPhoneElement.style.border = '2px solid red'
                }
            }
        }
    };

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
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <div className={s.mainBlock}>

            <div className={s.added} id='addedName'>The order was successful!</div>

            <h1>You order:</h1>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell align="right">Product name</StyledTableCell>
                            <StyledTableCell align="right">Price</StyledTableCell>
                            <StyledTableCell align="right">Number</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            order.map((item) => {
                                return (
                                    <StyledTableRow key={item.id}>
                                        <StyledTableCell component="th" scope="row">
                                            <img src={item?.image} alt={item?.title} width={50}/>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{item?.title}</StyledTableCell>
                                        <StyledTableCell align="right">{item?.price} $</StyledTableCell>
                                        <StyledTableCell align="right">{item?.count}</StyledTableCell>
                                    </StyledTableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <form onSubmit={handleSubmit} className={s.form}>
                <h2>Email:</h2>
                <TextField
                    label="Email"
                    variant="standard"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    id="email"
                    error={!validateEmail(formData.email)}
                    placeholder="Enter email..."
                    style={!validateEmail(formData.email) ? {borderBottom: '4px solid #d32f2f'} : undefined}
                />
                <h2>Name:</h2>
                <TextField
                    label="Name"
                    variant="standard"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name..."
                />
                <h2>Phone:</h2>
                <TextField
                    label="Phone number:"
                    variant="standard"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    id="phone"
                    error={!validatePhone(formData.phone)}
                    placeholder="+380632195777"
                    style={!validatePhone(formData.email) ? {borderBottom: '4px solid #d32f2f'} : undefined}
                />

                <Button
                    variant="contained"
                    className={s.butOrder}
                    type="submit"
                >Send</Button>

            </form>

        </div>
    );
};

export default Register;