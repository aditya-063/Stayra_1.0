import axios from 'axios';

const API_BASE_URL = '/api';

export const hotelApi = {
    search: async (searchData: {
        location: string;
        checkIn: string;
        checkOut: string;
        guests: number;
        rooms: number;
    }) => {
        const response = await axios.post(`${API_BASE_URL}/search`, searchData);
        return response.data;
    },
};
