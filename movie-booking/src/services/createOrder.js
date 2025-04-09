import api from './config'; 
export const createOrder = async (userId, selectedSeats, showtimeId) => {
  try {
   
    const orderDetails = selectedSeats.map(seat => ({
      ticketRequests: [
        {
          showTimeId: showtimeId,  
          seatId: seat,            
        }
      ]
    }));
    const response = await api.post('/orders/create-order', {
      userId,         
      orderDetails   
    });
    return response.data;  
  } catch (error) {
    console.error('Error creating order:', error);
    throw error; 
  }
};

export const createPaymentUrl = async (orderId, amount) => {  
    try {
      const response = await api.post("/payments/url", {
        orderId: orderId,
        amount: amount 
      });
      const paymentUrl = response.data.url;  
      return { url: paymentUrl };
    } catch (error) {
      console.error("Error getting payment URL:", error);
      throw new Error("Failed to generate payment URL.");
    }
  };
  

// import api from './config';

// export const createPaymentUrl = async (userId, selectedSeats, showtimeId) => {
//   try {
//     const orderDetails = selectedSeats.map(seat => ({
//       ticketRequests: [
//         {
//           showTimeId: showtimeId,
//           seatId: seat,
//         }
//       ]
//     }));

//     const response = await api.post('/payments/url', {
//       userId,
//       orderDetails
//     });

//     const data = response.data;
//     return {
//       url: data.url,
//       orderId: data.orderId || data.id,
//     };
//   } catch (error) {
//     console.error('Error in createOrderAndPaymentUrl:', error);
//     throw new Error('Failed to create order and get payment URL.');
//   }
// };
