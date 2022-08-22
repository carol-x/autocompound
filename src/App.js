/*global AlgoSigner*/

import React from 'react'
import Header from './components/Header/header'
import AlgoSigner from './components/AlgoSigner/AlgoSigner'
import { Main, MainBody } from './Main.styles' 
import './assets/css/app.css'

function App(){ 
        return(
         
            <MainBody>
                <Header/> 
                <Main>
                    <AlgoSigner/>         
                </Main>
            </MainBody>
        )
}

export default App
