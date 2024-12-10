import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user:null
  
};


const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
     
      setUser:(state,action)=>{
          state.user=action.payload
      },
      
    },
  });

  export const { setUser,setCount } = itemsSlice.actions;
export default itemsSlice.reducer;
