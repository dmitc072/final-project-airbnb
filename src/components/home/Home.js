import { SearchResults } from '../home/searchResults/SearchResults.js';
import { SearchBar } from '../home/searchBar/SearchBar.js';
import { useState, useEffect} from "react"
import { PendingApprovalMessages } from '../pendingApproval/PendingApprovalMessages.js';
import {ChangeOfPrice} from '../changeOfPrice/ChangeOfPrice.js'
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export const Home = () => {
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate()



    return (
        <>   
            <PendingApprovalMessages/> {/*send a message out for host if there is a pending request and redirects to pernding page*/}
            <ChangeOfPrice/>
            <SearchBar setSearchResult={setSearchResult} /> {/* Passing setSearchResult as a parameter */}
            <SearchResults searchResult={searchResult} />
          
            
        </>
    );
};
