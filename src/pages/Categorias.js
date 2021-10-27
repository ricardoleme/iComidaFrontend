import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'
import Modal from 'react-bootstrap/Modal'

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import { MdRestaurantMenu, MdMenuBook, MdModeEdit, MdDelete, MdSave } from 'react-icons/md'
import { BACKEND } from '../constants'

const Categorias = () => {
    const valorInicial = { nome: '', status: true }
    const [categoria, setCategoria] = useState(valorInicial)
    const [categorias, setCategorias] = useState([])
    const [carregandoCategorias, setCarregandoCategorias] = useState(false)
    const [erros, setErros] = useState({})
    const [aviso, setAviso] = useState('')
    const [salvandoCategorias, setSalvandoCategorias] = useState(false)
    const [confirmaExclusao, setConfirmaExclusao] = useState(false)

    const { nome, status } = categoria

    async function obterCategorias() {
        setCarregandoCategorias(true)
        let url = `${BACKEND}/categorias`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                setCategorias(data)
            })
            .catch(function (error) {
                console.error('Erro ao obter as categorias: ' + error.message)
            })
        setCarregandoCategorias(false)
    }

    useEffect(() => {
        obterCategorias()
        document.title = 'Cadastro de Categorias'
    }, [])

    const validaErrosCategoria = () => {
        const novosErros = {}
        //Validação do nome
        if (!nome || nome === '') novosErros.nome = 'O nome não pode ser vazio!'
        else if (nome.length > 30) novosErros.nome = 'O nome informado é muito longo'
        else if (nome.length < 3) novosErros.nome = 'O nome informado é muito curto'
        return novosErros
    }

    async function salvarCategoria(event) {
        event.preventDefault() // evita que a página seja recarregada
        const novosErros = validaErrosCategoria()
        if (Object.keys(novosErros).length > 0) {
            //Sim, temos erros!
            setErros(novosErros)
        } else {
            setSalvandoCategorias(true)
            const metodo = categoria.hasOwnProperty('_id') ? 'PUT' : 'POST'
            categoria.status = (categoria.status === true || categoria.status === 'ativo') ? 'ativo' : 'inativo'
            let url = `${BACKEND}/categorias`
            await fetch(url, {
                method: metodo,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            }).then(response => response.json())
            .then(data => {
                (data._id || data.message) ? setAviso('Registro salvo com sucesso') : setAviso('')
                setCategoria(valorInicial) //limpar a tela com os valores iniciais
                obterCategorias() //Atualizar a tela com os registros atualizados
            }).catch(function (error){
                console.error(`Erro ao salvar a categoria: ${error.message}`)
            })
            setSalvandoCategorias(false)
        }
    }

    async function excluirCategoria(){
        let url = `${BACKEND}/categorias/${categoria._id}`
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            data.message ? setAviso(data.message) : setAviso('')
            obterCategorias()
        })
        .catch(function (error) {
            console.error(`Erro ao excluir a categoria: ${error.message}`)
        })
    }

    const alteraDadosCategoria = e => {
        setCategoria({ ...categoria, [e.target.name]: e.target.value })
        setErros({})
    }

    return (
        <Container fluid className="p-0">
            <Cabecalho />
            <Row>
                <Col xs={12} lg={6}>
                    {/* Formulário de Categorias */}
                    <h4><MdRestaurantMenu /> Cadastro das Categorias</h4>
                    <Form method="post">
                        <Form.Group controlId="nome">
                            <Form.Label>Nome da Categoria</Form.Label>
                            <Form.Control
                                name="nome"
                                placeholder="Ex: Churrascarias"
                                value={nome}
                                onChange={alteraDadosCategoria}
                                isInvalid={!!erros.nome}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {erros.nome}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Check type="checkbox" label="Ativo" name="status"
                                onChange={(e) => setCategoria({ ...categoria, [e.target.name]: e.target.checked })}
                                checked={status} />
                        </Form.Group>
                        <Button variant="primary" type="submit"
                            onClick={(e) => salvarCategoria(e)}
                            title="Salvar o registro">
                            {salvandoCategorias
                                ? <><Spinner animation="border" size="sm" /> Aguarde...</>
                                : <><MdSave /> Salvar</>
                            }
                        </Button>
                    </Form>
                </Col>
                <Col xs={12} lg={6}>
                    {/* Listagem de Categorias */}
                    <h4><MdMenuBook /> Listagem das Categorias</h4>
                    {carregandoCategorias &&
                        <>
                            <Spinner animation="border" variant="primary" />
                            <p>Aguarde, enquanto as categorias são carregadas...</p>
                        </>
                    }
                    <Table striped bordered>
                        <thead>
                            <tr className="bg-info text-dark">
                                <th>Nome</th>
                                <th>Status</th>
                                <th>Inclusão</th>
                                <th>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map(item => (
                                <tr key={item._id}>
                                    <td>{item.nome}</td>
                                    <td>{item.status}</td>
                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Button variant="outline-primary" title="Editar o registro"
                                        onClick={() => setCategoria(item)}
                                        >
                                            <MdModeEdit />
                                        </Button>
                                        &nbsp;
                                        <Button variant="outline-danger" title="Apagar o registro"
                                        onClick={() => {
                                            setConfirmaExclusao(true)
                                            setCategoria(item)
                                        }}
                                        >
                                            <MdDelete />
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-success text-white">
                                <td colSpan="3">Total de Registros:</td>
                                <td>{categorias.length}</td>
                            </tr>
                        </tbody>

                    </Table>
                </Col>

            </Row>
            <Toast
                onClose={() => setAviso('')}
                show={aviso.length > 0}
                animation={false}
                delay={4000}
                autohide
                className="bg-success"
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10
                }}>
                <Toast.Header closeButton={false}>Aviso</Toast.Header>
                <Toast.Body>{aviso}</Toast.Body>
            </Toast>
            <Modal animation={false} show={confirmaExclusao}
            onHide={()=> setConfirmaExclusao(false)}>
                <Modal.Header>
                    <Modal.Title>Confirmação da Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Confirma a exclusão da categoria selecionada?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setConfirmaExclusao(!confirmaExclusao)}>
                    ❌Cancelar
                    </Button>
                    <Button variant="success"
                    onClick={() => {
                        excluirCategoria()
                        setConfirmaExclusao(!confirmaExclusao)
                    }}>
                    ✅Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Rodape />
        </Container>
    )
}

export default Categorias