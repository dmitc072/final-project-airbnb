import React, { createContext, useState} from 'react';
export const AppContext = createContext({});

const AppContextProvider = (props) => {

  const [changeWarning, setChangeWarning] = useState(false);


    const row = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    }

    const column = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }

    const [pendingApprovalMessage, setPendingApprovalMessage] = useState(true);



    const value = {
        row,
        column,
        pendingApprovalMessage, 
        setPendingApprovalMessage,
        changeWarning, 
        setChangeWarning
    };

return (
    <AppContext.Provider value={value}> 
        {props.children} 
    </AppContext.Provider>
  );
};

export default AppContextProvider;