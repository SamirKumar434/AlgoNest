const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63,
        "python": 71  // Add this line for Python
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    try {
        console.log('Sending to Judge0 - submissions count:', submissions.length);
        const response = await axios.request(options);
        console.log('Judge0 response status:', response.status);
        console.log('Judge0 response data:', response.data);
        
        // Check if response has the expected structure
        if (!response.data || !Array.isArray(response.data)) {
            console.log('Unexpected Judge0 response structure:', response.data);
            throw new Error('Judge0 returned unexpected response structure');
        }
        
        return response.data;
    } catch (error) {
        console.error('Judge0 API Error - Status:', error.response?.status);
        console.error('Judge0 API Error - Data:', error.response?.data);
        console.error('Judge0 API Error - Message:', error.message);
        throw error;
    }
};
const waiting=async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}


const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': '0d2e072e44msh4c906777514ac22p1d1ff4jsn95db9ac5e216',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log('submitToken response:', response.data);
        
        const isResultObtained = response.data.submissions.every((r) => r.status_id > 2);
        
        if (isResultObtained) {
            return response.data.submissions;
        }
        
        // Wait and retry if results aren't ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await submitToken(resultToken); // Recursive call
        
    } catch (error) {
        console.error('Error in submitToken:', error);
        throw error;
    }
};



module.exports = {getLanguageById,submitBatch,submitToken};








// 