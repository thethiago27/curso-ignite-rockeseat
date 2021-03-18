import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App'
import {createServer, Model} from 'miragejs'
import {GlobalStyle} from "./assets/styles/Global";

createServer({

    models: {
        transaction: Model
    },

    seeds(server) {
        server.db.loadData({
            transactions: [
                {
                    id: 1,
                    title: 'Freelance',
                    type: 'deposit',
                    category: 'dev',
                    amount: 6000,
                    createAt: new Date()
                },
                {
                    id: 2,
                    title: 'Programa',
                    type: 'deposit',
                    category: 'programa',
                    amount: 500,
                    createAt: new Date()
                },
                {
                    id: 3,
                    title: 'Comida',
                    type: 'withdraw',
                    category: 'alimentação',
                    amount: 400,
                    createAt: new Date()
                }
            ]
        })
    },

    routes() {
        this.namespace = 'api'
        this.get('/transactions', () => {
            return this.schema.all('transaction')
        })

        this.post('/transactions', (schema, request) => {
            const data = JSON.parse(request.requestBody)

            return schema.create('transaction', data)
        })

    }
})



ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalStyle/>
  </React.StrictMode>,
  document.getElementById('root')
);


