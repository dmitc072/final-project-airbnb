import React, { createContext} from 'react';
export const AppContext = createContext({});

const AppContextProvider = (props) => {


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




    const value = {
        row,
        column
    };

return (
    <AppContext.Provider value={value}> 
        {props.children} 
    </AppContext.Provider>
  );
};

export default AppContextProvider;