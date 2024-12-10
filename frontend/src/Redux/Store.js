import {configureStore} from '@reduxjs/toolkit'
import slice from './Slice'

const store = configureStore({
    reducer:slice
})

export default store