import React, { useEffect, useState } from 'react'
import Header from "../components/Header/index";
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { formatDate } from '@/helper';
import Link from 'next/link'
import SpinnerLoader from '@/components/Loader';

const OrderList = () => {
    const [orders,setorders] = useState([])
    const [loader, setLoader] = useState(false)

    const getData = async()=>{
        try {
            setLoader(true)
            const res = await axios.get(`/api/order/all`);
            setorders(res.data)
            setLoader(false)
          } catch (err) {
            console.error(err);
            setLoader(false)
          }
    }
    const deleteOrder = async(orderId)=>{
        try{
            setLoader(true)
            const res = await axios.get(`/api/order/delete?id=${orderId}`);
            alert("order deleted")
            await getData()
            setLoader(false)
          }
          catch(err){
            console.log(err)
            setLoader(false)
          }
           
    }
    useEffect(()=>{
        getData()
    },[])

  return (
    <>
    <Header/>
    {/* page header strat */}
    <div className=' page_header py-8 text-center'>
    <h1 className='text-white fs_28'>shop</h1>
    <p className='mb-0 text-white'>Home/page</p>
    </div>

    <div className="container md:mx-auto px-20 py-8">
        <div className="flex justify-center mb-10">
            <div className=' w-full pr-8'>
                <div className="text-black font-bold grid grid-cols-8">
                   <div className="text-center">S. No</div>
                   <div className="text-center text-ellipsis overflow-hidden truncate">Order Id</div>
                   <div className="text-center">Order Date</div>
                   <div className="text-center">Total Amount</div>
                   <div className="text-center">City</div>
                   <div className="text-center">Country</div>
                   <div className="text-center">ZipCode</div>
                   <div className="text-center">Action</div>
                </div>
                {
                    orders?.map((order, index) => (
                        <div className=" drop-shadow-xl grid grid-cols-8 mt-[2rem]" key={index}>
                            <div className="text-center">{index + 1}</div>
                            <div className="text-center">
                                <Link href={{pathname:'/edit-order', query:{order: JSON.stringify(order)}}}>
                                    <p>{order.orderId.slice(0,10) + "..."}</p>
                                </Link>
                            </div>
                            <div className="text-center">{formatDate(order?.createdOn)}</div>
                            <div className="text-center">$ {order.totalAmount}</div>
                            <div className="text-center">{order?.userAddress?.City}</div>
                            <div className="text-center">{order?.userAddress?.Country}</div>
                            <div className="text-center">{order?.userAddress?.ZipCode}</div>
                            <div className="text-center">
                                <Link href={{pathname:'/edit-order', query:{order: JSON.stringify(order)}}}>
                                    <Button className="bg-transparent hover:bg-transparent px-3 me-2  border-red-800 border-2 text-red-800" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                        </svg>
                                    </Button>
                                </Link>
                                <Button className="bg-transparent hover:bg-transparent px-3  border-red-800 border-2 text-red-800" onClick={() => (deleteOrder(order?.orderId))}>
                                    <svg className="inline me-[1rem]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                    </svg>
                                </Button>


                                

                                
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        </div>

        <SpinnerLoader show={loader} closeShow={() => setLoader(false)}/>
    </>
  )
}

export default OrderList
