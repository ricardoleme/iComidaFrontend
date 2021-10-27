import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Inicio from '../pages/Inicio'
import Categorias from '../pages/Categorias'

export default function Rotas(){
    return(
        <HashRouter>
            <Switch>
                <Route exact path="/" component={Inicio} />
                <Route exact path="/categorias" component={Categorias} />
            </Switch>
        </HashRouter>
    )
}