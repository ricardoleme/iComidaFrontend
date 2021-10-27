import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//Para consultar os ícones: https://react-icons.github.io/react-icons/icons?name=md
import { MdRestaurantMenu,  MdHome, MdLocalPizza } from 'react-icons/md'

const Cabecalho = () => {
    return (
    <Navbar bg="primary" variant="dark">
        <Navbar.Brand><MdLocalPizza/> iComida</Navbar.Brand>
        <Nav className="mr-auto">
            <Nav.Link href="#/"><MdHome/> Início</Nav.Link>
            <Nav.Link href="#/categorias"><MdRestaurantMenu/> Categorias</Nav.Link>
        </Nav>
    </Navbar>
    )
}

export default Cabecalho