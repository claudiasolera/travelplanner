import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.EXCHANGE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`;

export const getExchangeRate = async (from, to) => {
    try {
        const response = await fetch(`${BASE_URL}/${from.toUpperCase()}/${to.toUpperCase()}`);
        const data = await response.json();

        if (data.result === "success") {
            return data.conversion_rate;
        } else {
            console.error("Error de la API:", data['error-type']);
            return null;
        }
    } catch (error) {
        console.error("Error de conexión con ExchangeRate:", error);
        return null;
    }
};