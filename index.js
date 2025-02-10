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