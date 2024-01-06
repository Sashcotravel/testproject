import './Navbar.scss'
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../utils/interface.ts";


const Navbar: React.FC = () => {

    const numGoods = useSelector((state: RootState) => state.basket.goods)
    const [num, setNum] = useState(0)

    useEffect(() => {
        const uniqueTitles = new Set(numGoods.map(item => item?.title));
        setNum(uniqueTitles.size)
    }, [numGoods]);

    return (
        <div className='navbar'>
            <div className="wrapper">
                <Link to='/'>Sashkotravel</Link>
                <div className='social'>
                    <Link to='/basket' className='linkImage'>
                        <span>{num}</span>
                        <img src='/basket.png' alt='basket' />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;