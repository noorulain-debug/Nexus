import { useState, useEffect } from "react";

const PaymentsPage = () => {

  const [balance, setBalance] = useState(10000);
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  // Load data
  useEffect(() => {
    const savedTx = localStorage.getItem("transactions");
    const savedBalance = localStorage.getItem("balance");

    if (savedTx) setTransactions(JSON.parse(savedTx));
    if (savedBalance) setBalance(JSON.parse(savedBalance));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("balance", JSON.stringify(balance));
  }, [transactions, balance]);

  const handleTransaction = (type: string) => {

    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    let newBalance = balance;

    if (type === "deposit") {
      newBalance += value;
    }

    if (type === "withdraw") {
      if (value > balance) {
        alert("Insufficient balance");
        return;
      }
      newBalance -= value;
    }

    if (type === "transfer") {
      if (!receiver) {
        alert("Enter receiver name");
        return;
      }
      if (value > balance) {
        alert("Insufficient balance");
        return;
      }
      newBalance -= value;
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: value,
      receiver: type === "transfer" ? receiver : "-",
      date: new Date().toLocaleString(),
      status: "completed"
    };

    setBalance(newBalance);
    setTransactions([newTransaction, ...transactions]);

    setAmount("");
    setReceiver("");
  };

  const getColor = (type: string) => {
    if (type === "deposit") return "text-green-600";
    if (type === "withdraw") return "text-red-600";
    return "text-purple-600";
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">💳 Payments</h2>

      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl mb-6 shadow">
        <h3 className="text-lg">Wallet Balance</h3>
        <p className="text-3xl font-bold mt-2">${balance}</p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-2">

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Receiver (for transfer)"
          value={receiver}
          onChange={(e)=>setReceiver(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={()=>handleTransaction("deposit")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Deposit
        </button>

        <button
          onClick={()=>handleTransaction("withdraw")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Withdraw
        </button>

        <button
          onClick={()=>handleTransaction("transfer")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Transfer
        </button>

        <button
          onClick={()=>handleTransaction("transfer")}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Fund Startup
        </button>

      </div>

      {/* Transactions */}
      <div>

        <h3 className="font-semibold mb-2">Transaction History</h3>

        <table className="w-full border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Receiver</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t)=>(
              <tr key={t.id} className="text-center border-t">

                <td className={`p-2 capitalize font-medium ${getColor(t.type)}`}>
                  {t.type}
                </td>

                <td className="p-2">${t.amount}</td>

                <td className="p-2">{t.receiver}</td>

                <td className="p-2 text-sm">{t.date}</td>

                <td className="p-2 text-green-600">
                  {t.status}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default PaymentsPage;