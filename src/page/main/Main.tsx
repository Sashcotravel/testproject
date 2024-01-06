import React, {useEffect, useState} from 'react';
import s from './main.module.css'
import {useDispatch, useSelector} from "react-redux";
import {addNumberGoods} from "../../../store/basket-reduser.js";
import {Link} from "react-router-dom";
import {ICountedProduct, RootState} from "../../utils/interface.ts";
import {Button, FormControlLabel, Pagination, Radio, RadioGroup, Stack, TextField} from "@mui/material";

const Main: React.FC = () => {

    const [searchResult, setSearchResult] = useState<ICountedProduct[]>([])
    const [allProduct, setAllProduct] = useState<ICountedProduct[]>([])
    const [allCategories, setAllCategories] = useState<string[]>([])
    const [category, setCategory] = useState('all')
    const [title, setTitle] = useState('')
    const [addedName, setAddedName] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Кількість товарів на сторінці
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResult
        .filter((item) => category === 'all' || item.category === category)
        .slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(searchResult.filter((item) => category === 'all' ||
            item.category === category).length / itemsPerPage);

    const dispatch = useDispatch()

    const productState = useSelector((state: RootState) => state.basket.allProduct)
    const categories = useSelector((state: RootState) => state.basket.categories)

    useEffect(() => {
        setAllProduct(productState);
        setSearchResult(productState);
        setAllCategories(categories)
    }, [productState, category]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage]);

    useEffect(() => {
        setTimeout(() => {
            const addedNameElement = document.getElementById('addedName');
            if (addedNameElement) {
                addedNameElement.style.display = 'none';
            }
        }, 3000)
    }, [addedName]);

    const changeTel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        let searchTitle = e.target.value
        const filteredResults = allProduct.filter(item => {
            const itemTitle = item.title.toLowerCase();
            return itemTitle.includes(searchTitle.toLowerCase());
        });

        const sortedResults = filteredResults.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return titleA.localeCompare(titleB);
        });

        setSearchResult(sortedResults);
    };

    const addGoods = (item: ICountedProduct) => {
        dispatch(addNumberGoods(item))
        const addedNameElement = document.getElementById('addedName')
        if(addedNameElement){
            addedNameElement.style.display = 'flex'
        }
        setAddedName(item.title)
    }

    const addCategory = (item: string) => {
        setCategory(item)
        setCurrentPage(1);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    return (
        <div className={s.mainBlock}>

            <div className={s.added} id='addedName'>Good {addedName} added</div>

            <TextField id="outlined-search" className={s.input} label="Search field" type="search"
                       onChange={changeTel} value={title} />

            <div className={s.divMainBox}>
                <div className={s.divBox1}>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={category}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => addCategory(e.target.value)}
                    >
                        <FormControlLabel value="all"
                                          control={<Radio color="warning" />} label="All" />
                        {
                            allCategories?.map((item, index) => {
                                return (
                                    <FormControlLabel value={item} key={index}
                                                      control={<Radio color="warning" />} label={item} />
                                )
                            })
                        }
                    </RadioGroup>
                </div>
                <div className={s.divBox2}>
                    {currentItems.map((item) => {
                        return (
                            <div key={item?.id} className={s.boxGoods}>
                                <Link to={`/goods/${item?.id}`}>
                                    <img src={item?.image} alt={item?.title} />
                                </Link>
                                <div>
                                    <Link to={`/goods/${item?.id}`}>
                                        <p>{item?.title}</p>
                                        <p>Категорія - {item?.category}</p>
                                        <p>Оцінка товару {item?.rating?.rate}</p>
                                        <p>{item?.description?.slice(0, 60)}...</p>
                                        <p>{item?.price} $</p>
                                    </Link>
                                    <Button color="secondary" onClick={() => addGoods(item)}>Buy</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={s.divPagination}>
                <Stack spacing={2}>
                    <Pagination
                        color="secondary"
                        count={totalPages}
                        variant="outlined"
                        shape="rounded"
                        page={currentPage}
                        onChange={(_, page: number) => handlePageChange(page)}
                    />
                </Stack>
            </div>

        </div>
    );
};

export default Main;