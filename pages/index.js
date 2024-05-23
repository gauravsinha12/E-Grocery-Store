import { Inter } from "next/font/google";
import Header from "../components/Header/index";
import Modal from 'react-modal';
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"
import axios from "axios";
import {generateArray} from "../helper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'
import SpinnerLoader from "@/components/Loader";



export default function Home(props) {
  
  const [products, setProducts] = useState([])
  const [priceRange, setPriceRange] = useState({min:0, max:2000})
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(null)
  const [selectedPage, setSelectedPage] = useState(1)
  const [loader, setLoader] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [productData, setProductData] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])
  const [sortProductPrice, setSortProductPrice] = useState("")


  // pagination data
  const totalPages = Math.ceil(total / Number(limit))


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)' // Change the opacity value (0.5) as needed
    }
  };

  const openModal=()=> {
    setIsOpen(true);
  }

  const getData = async () => {
    try {
      setLoader(true)
      const {min, max} = priceRange
      const offset = (selectedPage - 1) * limit
      const res = await axios.get(`/api/getData?limit=${limit}&offset=${offset}&min_price=${min}&max_price=${max}`);
      setProducts(res.data.data)
      setTotal(res.data.page?.total)
      setLoader(false)
    } catch (err) {
      console.error(err);
      setLoader(false)
    }
  };

  const addProduct = async() => {
    try{
      setLoader(true)
      const {name, quantity, price} = productData
      if(name && quantity && price){
        await axios.post(`/api/addProduct`, productData);
        alert("Product added")
        await getData()
        closeModal()
        
      } else {
        alert("All fields required.")
      }
      setLoader(false)
    }
    catch(err){
      console.log(err)
      setLoader(false)
    }
  }

  const deleteProduct = async (id) => {
    try{
      setLoader(true)
      const res = await axios.get(`/api/deleteProduct?id=${id}`);
      alert("Product deleted")
      await getData()
      setLoader(false)
    }
    catch(err){
      console.log(err)
      setLoader(false)
    }
  }

  const editProduct = (el)=>{
    setIsOpen(true)
    setProductData({...el, edit:true})

  }
  const saveProduct = async()=>{
    try{
      setLoader(true)
      const {name, quantity, price, id} = productData
      if(name && quantity && price && id){
        await axios.post(`/api/saveProduct`, productData);
        alert("product save")
        await getData() 
        closeModal()
      } else {
        alert("All fields required.")
      }
      setLoader(false)
    }
    catch(err){
      console.log(err)
      setLoader(false)
    }
  }

  const updateSelectedProduct = (el)=>{
     if(selectedProducts.find((product)=> product?.id === el?.id )){
        const index = selectedProducts.findIndex((product)=>(product?.id === el?.id))
        setSelectedProducts(selectedProducts.toSpliced(index, 1))
      } else{
        setSelectedProducts([...selectedProducts, el])
      }
  }

  const deleteProducts = async()=>{
    try{
      setLoader(true)
      const promise = selectedProducts.map(async (id,i)=> await axios.get(`/api/deleteProduct?id=${id}`))
      await Promise.all(promise)
      setSelectedProducts([])
      getData()     
      setLoader(false) 
    } catch(err){
      console.log(err)
      setLoader(false)
    }
  
  }

  const selectAll = ()=>{

    if(selectedProducts.length === products.length){
      setSelectedProducts([])
    }else{
      setSelectedProducts([...products]) 
    }

  }

  const sortPrice =(type)=>{
    setSortProductPrice(type)
    if(type == "ascending"){
      const sort = products.sort((a,b)=>(a.price - b.price))

      setProducts([...sort])
    } else if(type == "desanding"){
      const sort = products.sort((a,b)=>(b.price - a.price))
      setProducts([...sort])
    }
  }


  const closeModal = () => {
    setIsOpen(false)
    setProductData({})
  }


  useEffect(() => {
   getData()
  },[priceRange, selectedPage, limit])

  useEffect(()=>{
   totalPages
  },[limit, total])
  
  return (
    <>
    <Header/>
    

    {/* page header strat */}
    <div className=' page_header py-8 text-center'>
        <h1 className='text-white fs_28'>shop</h1>
        <p className='mb-0 text-white'>Home/page</p>

    </div>
     {/*page header end  */}
     

   
      <div className="container md:mx-auto px-20 py-8 fruit_shop">
        <div className="flex-col md:flex-row  flex justify-between mb-6 items-center"> 
          {/* <div className="serch_input">
            <div className="flex mb-0">
              <input type="text" className=" form-control border border-gray-300 p-3 rounded_start_10 focus:outline-none" placeholder="Enter your text..."/>
              <span className="bg-slate-200 text_dark  p-5 rounded_end_10 focus:outline-none"> <FontAwesomeIcon icon={faMagnifyingGlass} /></span>
            </div>
          </div> */}
          <h1 className="mb-0 text_primary text-4xl">Products List</h1>

          <div className="filter flex items-center">
            <div className="sorting flex rounded bg_light justify-between items-center pr-3 py-3 px-7 mb-0 mr-3 bg-slate-300 shadow-lg">
                <div className="lable mr-10">
                  <label>Items Count</label>
                </div>

                <div className="select w-[5rem]">
                  <select className="w-full" onChange={e => setLimit( e.target.value)}>
                    <option value="5" selected={limit == 5}>5</option>
                    <option value="10" selected={limit == 10}>10</option>
                    <option value="20" selected={limit == 20}>20</option>
                    <option value="100" selected={limit == 100}>All</option>
                  </select>
                </div>
            </div>

            {
              selectedProducts.length
              ?
              <Link href={{pathname:'/orders', query:{product: JSON.stringify(selectedProducts)}}}>
                <Button className="bg-red-400 mr-4"> Buy Now</Button>
              </Link>
              :
              <Button className="bg-red-400 mr-4" onClick={()=> alert("Please select Product")}> Buy Now</Button>

            }
            

            <Button className="bg-transparent hover:bg-transparent mr-4  border-red-800 border-2 text-red-800" onClick={()=> selectAll()}>
             
              {selectedProducts.length === products.length ? "Unselect All" : "Select All"}
            </Button>
            {
              selectedProducts.length
              ?
              <Button className="bg-transparent hover:bg-transparent mr-4  border-red-800 border-2 text-red-800" onClick={()=>deleteProducts()}>
            
              Delete All
            </Button>
              :
              ""
            }
            <Button className="bg-transparent hover:bg-transparent px-3  border-red-800 border-2 text-red-800" onClick={openModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red"  class="bi bi-plus-lg text-red-900" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
            </svg>
              <span className="text-red-800 ml-2">Add</span>
            </Button>
           
          </div>
        </div>


          

        <div className="flex justify-between">
          <div className="sidebar w-2/5 sm:w-1/5">
            <div className="range_slider mb-5">
              <h4 className="mb-3">Price Range</h4>
              <p>Min Price - ($ {priceRange?.min})</p>
              <input type="range" className="form-range w-[104px] md:w-[150px]" id="customRange2" min={0} max={2000} name="minRange" value={priceRange?.min} onChange={(e)=>setPriceRange({...priceRange,min: e.target.value})}></input>
              <p>Max Price - ($ {priceRange?.max})</p>
              <input type="range" className="form-range w-[104px] md:w-[150px]" id="customRange2" min={0} max={2000}  name="maxRange" value={priceRange?.max} onChange={(e)=>setPriceRange({...priceRange, max:e.target.value})}></input>
              <p>{priceRange?.max}</p>
            </div>

            <div className='shorting'>
                <div className='mb-3'>
                    <h4 className="mb-3">Price</h4>
                    <div className='mb-2'  onClick={()=> sortPrice("ascending")}>
                        <input className="form-check-input rounded-circle me-2" type="radio"  name="organic" checked={sortProductPrice ==="ascending" }   />
                        <label className="form-check-label">
                            Low to High
                        </label>
                    </div>
                    <div className='mb-2' onClick={()=> sortPrice("desanding")}>
                        <input className="form-check-input rounded-circle me-2" type="radio" name="fresh" checked={sortProductPrice === "desanding"}  />
                        <label className="form-check-label">
                            High to Low
                        </label>
                    </div>
                </div>
            </div>
          </div>
                        
          <div className="product w-3/5 sm:w-4/5 pl-[0rem]  sm:pl-[4rem]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {
                products?.map((el, i)=>(
                  <Card key={i} className="justify-center flex flex-col shadow-lg hover:shadow-2xl relative">
                    <div className="space-x-2 absolute right-5 top-3">
                        <input type="checkbox" className="w-[20px] h-[20px]" checked={selectedProducts.find((item)=>item?.id === el?.id)} onChange={(e)=>updateSelectedProduct(el)}/>
                    </div>
                       
                  <CardHeader>
                    <CardTitle>Name: {el?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                  
                      <p className="text-gray-600 font-semibold text-xl mb-4">
                      Price: {`${el?.price}$`}
                      </p>
                      <CardDescription>Quantity: {el?.quantity}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between mt-5">
                    <Button className="bg-red-400" onClick={() => deleteProduct(el?.id)}>Delete</Button>
                    <Button className="bg-red-400" onClick={()=> editProduct(el)}>
                      Edit
                    </Button>
                  </CardFooter>
                      

                  </Card>


                ))
              }

            </div> 
            <div className="pagination my-[3rem]">
              <Pagination>
                <PaginationContent>
                  <PaginationItem className="cursor-pointer" onClick={() => setSelectedPage(selectedPage - 1 || 1)}>
                    <PaginationPrevious />
                  </PaginationItem>
                  {
                    generateArray(totalPages)?.map((num,index) => (
                      <PaginationItem key={index} onClick={() => setSelectedPage(num)}>
                        <PaginationLink><p className={`px-3 py-1 rounded-md cursor-pointer ${selectedPage === num ? "bg-red-400 text-gray-900" : ""}`}>{num}</p></PaginationLink>
                      </PaginationItem>
                    ))
                  }
                  <PaginationItem  className="cursor-pointer" onClick={() =>  selectedPage === totalPages ?  "" : setSelectedPage(selectedPage + 1)} >
                    <PaginationNext />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
            

           
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Product Modal"
      >
        <button onClick={closeModal} className="float-right">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
        </button>
        <Card className="w-[350px] border-none">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name"> Product Name</Label>
              <Input id="name" placeholder="Product Name" value={productData?.name} onChange={(e)=> setProductData({...productData,name: e.target.value})} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name"> Product Quantity</Label>
              <Input id="name" type="number" placeholder="Product Quantity" value={productData?.quantity} onChange={(e)=> setProductData({...productData,quantity: e.target.value})} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name"> Product price</Label>
              <Input id="name" type="number" placeholder="Product price" value={productData?.price} onChange={(e)=> setProductData({...productData,price: e.target.value})} />
            </div>
            
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={closeModal}>Cancel</Button>
        {
          productData?.edit
          ?
          <Button onClick={saveProduct}>Save</Button>
          :
          <Button onClick={addProduct}>Add</Button>

        }
      </CardFooter>
    </Card>
      </Modal>

          


        <SpinnerLoader show={loader} closeShow={() => setLoader(false)}/>



    </>
  );
}