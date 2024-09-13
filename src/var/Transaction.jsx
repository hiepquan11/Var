import { useEffect, useState } from "react";

function Transactions (){
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [tempKeyWord, setTempKeyWord] = useState('');
    const pageSize = 8;
    useEffect(() =>{
        let url=''
        if(searchTerm.trim() === ''){
            url = `http://localhost:8080/transactions?page=${currentPage}&size=${pageSize}`;
        } else {
            
            url = `http://localhost:8080/transactions/search/findTransactionsByDescriptionContaining?description=${searchTerm}&page=${currentPage}&size=${pageSize}`;

        }
        const response = fetch(url).then(response => response.json()).then(
            transactionsData =>{
                setData(transactionsData._embedded.transactionses)
                setTotalPages(transactionsData.page.totalPages)
            }
        ).catch(error => console.log(error))
       
    },[currentPage, searchTerm])

    const formatDate = (dateString) =>{
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN',{
            year: 'numeric',
            month:'2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    useEffect(() =>{
        setCurrentPage(0)
    },[searchTerm])
    
    const handleInputChange = (event) =>{
        event.preventDefault()
        setTempKeyWord(event.target.value)
    }

    // Filtered data based on search term
  const handleSubmit = (event) =>{
    event.preventDefault()
        setSearchTerm(tempKeyWord)
  }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        
    };
    return(
        <div className="flex flex-col items-center justify-center">
            <form className="mb-4 pt-10 w-full" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo nội dung giao dịch (Lưu ý: nội dung giao dịch viết không dấu)"
                    value={tempKeyWord}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-4 py-2 w-1/2"
                />
            </form>
        <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
                <tr className="bg-gray-100 ">
                    <th className="border border-gray-300 ">Ngày</th>
                    <th className="border border-gray-300 px-4 py-2">Số tiền</th>
                    <th className="border border-gray-300 px-4 py-2">Nội dung</th>
                </tr>
            </thead>
            <tbody>
               
                {data.map((item, index) =>(
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="boder border-gray-300 px-4 py-2">{formatDate(item.updated_at)}</td>
                        <td className="boder border-gray-300 px-4 py-2">{item.amount}</td>
                        <td className="boder border-gray-300 px-4 py-2">{item.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span>
                    Trang {currentPage + 1} trong {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        
    </div>
    )
}
export default Transactions;