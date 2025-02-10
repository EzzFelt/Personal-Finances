let transactions = []

// Creating the container for each transaction by ID
function createTransactionContainer(id) {
    const container = document.createElement('div')
    container.classList.add('transaction')
    container.id = `transaction-${id}`
    return container
  }
  
// Creating the title for each transaction
  function createTransactionTitle(name) {
    const title = document.createElement('span')
    title.classList.add('transaction-title')
    title.textContent = name
    return title
  }

// Using the number formatter API for the user Currency which is BRL
  function createTransactionAmount(amount) {
    const span = document.createElement('span')
    span.classList.add('transaction-amount')
    const formater = Intl.NumberFormat('pt-BR', {
      compactDisplay: 'long',
      currency: 'BRL',
      style: 'currency',
    })
    const formatedAmount = formater.format(amount)

// If the value is positive it'll be credit, otherwise will be debit
    if (amount > 0) {
      span.textContent = `${formatedAmount} C`
      span.classList.add('credit')
    } else {
      span.textContent = `${formatedAmount} D`
      span.classList.add('debit')
    }
    return span
  }

// Function that renders the user's transaction in the screen
  function renderTransaction(transaction) {
    const container = createTransactionContainer(transaction.id)
    const title = createTransactionTitle(transaction.name)
    const amount = createTransactionAmount(transaction.amount)
  
    document.querySelector('#transactions').append(container)
    container.append(title, amount)
  }

// Getting the data from the backend
  async function fetchTransactions() {
    return await fetch('http://localhost:3000/transactions').then(res => res.json())
  }


// This function updates the user balance by getting the information from array transactions
function updateBalance() {
    const balanceSpan = document.querySelector('#balance')
    const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    const formater = Intl.NumberFormat('pt-BR', {
      compactDisplay: 'long',
      currency: 'BRL',
      style: 'currency'
    })
    balanceSpan.textContent = formater.format(balance)
  }

// This function is called as soon as the page is loaded, rendering the transactions and getting the data from backend
  async function setup() {
    const results = await fetchTransactions()
    transactions.push(...results)
    transactions.forEach(renderTransaction)
    updateBalance()
  }

// This function saves the user transaction in the backend, using the method POST
  async function saveTransaction(ev) {
    ev.preventDefault()
  
    const id = document.querySelector('#id').value
    const name = document.querySelector('#name').value
    const amount = parseFloat(document.querySelector('#amount').value)
  
    if (id) {
        const response = await fetch(`http://localhost:3000/transactions/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name, amount }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const transaction = await response.json()
        const indexToRemove = transactions.findIndex((t) => t.id === id)
        transactions.splice(indexToRemove, 1, transaction)
        document.querySelector(`#transaction-${id}`).remove()
        renderTransaction(transaction)
      } else {
    const response = await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      body: JSON.stringify({ name, amount }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const transaction = await response.json()
    transactions.push(transaction)
    renderTransaction(transaction)
  
    ev.target.reset()
    updateBalance()
  }
}

// This function creates an edit button for each transaction
  function createEditTransactionBtn(transaction) {
    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-btn')
    editBtn.textContent = 'Editar'
    editBtn.addEventListener('click', () => {
      document.querySelector('#id').value = transaction.id
      document.querySelector('#name').value = transaction.name
      document.querySelector('#amount').value = transaction.amount
    })
    return editBtn
  }

  // Creating an delete button for each transaction, using the method DELETE
  function createDeleteTransactionButton(id) {
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete-btn')
    deleteBtn.textContent = 'Excluir'
    deleteBtn.addEventListener('click', async () => {
      await fetch(`http://localhost:3000/transactions/${id}`, { method: 'DELETE' })
      deleteBtn.parentElement.remove()
      const indexToRemove = transactions.findIndex((t) => t.id === id)
      transactions.splice(indexToRemove, 1)
      updateBalance()
    })
    return deleteBtn
  }
  
  document.addEventListener('DOMContentLoaded', setup)
  document.querySelector('form').addEventListener('submit', saveTransaction)