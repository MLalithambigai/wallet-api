// react custom hook file

import { useCallback, useState} from "react";
import { Alert} from 'react-native'

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api"
).replace(/\/$/, "");

export const useTransactions=(userId)=>{
  const [transactions,setTransactions]=useState([]);
  const [summary, setSummary]=useState({
    balance:0,
    income:0,
    expenses:0
  });
  const [errors, setErrors] = useState({ transactions: null, summary: null });
  const [isLoading, setIsLoading]=useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions=useCallback(async()=>{
    try{
      const response=await fetch(`${API_URL}/transactions/${userId}`);
      if (!response.ok) {
        throw new Error(`Fetching transactions failed (${response.status})`);
      }
      const data=await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Transactions API returned an unexpected response");
      }
      setTransactions(data);
      setErrors((current) => ({ ...current, transactions: null }));
    }
    catch(error){
      const message =
        error instanceof Error ? error.message : "Unknown transactions request error";
      setErrors((current) => ({ ...current, transactions: message }));
    }
    finally{
      setIsLoading(false);
    }
  },[userId]);

  const fetchSummary=useCallback(async()=>{
    try{
      const response=await fetch(`${API_URL}/transactions/summary/${userId}`);
      if (!response.ok) {
        throw new Error(`Fetching transaction summary failed (${response.status})`);
      }
      const data=await response.json();
      if (
        !data ||
        typeof data !== "object" ||
        !("balance" in data) ||
        !("income" in data) ||
        !("expenses" in data)
      ) {
        throw new Error("Transaction summary API returned an unexpected response");
      }
      setSummary(data);
      setErrors((current) => ({ ...current, summary: null }));
    }
    catch(error){
      const message =
        error instanceof Error ? error.message : "Unknown summary request error";
      setErrors((current) => ({ ...current, summary: message }));
    }
  },[userId]);

  const loadData=useCallback(async()=>{
    if(!userId) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } finally {
      setIsLoading(false);
    }
  },[fetchTransactions, fetchSummary, userId]);

  const deleteTransaction=async (id)=>{
    try {
      const response=await fetch(`${API_URL}/transacions/${id}`,{method:"DELETE"});
      if(! response.ok) throw new Error("Failed to delete transactions");

      // Refresh data after deletion
      loadData();
      Alert.alert("Success","Transction deleted successfully");

    }
    catch(error){
      console.error("Error deleting transction:",error);
      Alert.alert("Error",error.message)
    }
  }
return {transactions, summary, errors, isLoading, loadData, deleteTransaction}

}