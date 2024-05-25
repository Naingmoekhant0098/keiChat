import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import userSlice from './userSlice'
 
// import rootReducer from './reducers'
const rootReducer = combineReducers({
    user : userSlice
})
 
const persistConfig = {
  key: 'root',
  storage,
  version :1
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store =  configureStore({
    reducer : persistedReducer,
    middleware : ((getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck : false}))
})

export const persistor = persistStore(store)