// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_KEY = "bcafdf5ae48f17e65499d8f7e196bc4c";
// const BASE_URL = "https://api.themoviedb.org/3";

// const MovieCast = ({ movieId }) => {
//   const [cast, setCast] = useState([]);

//   useEffect(() => {
//     const fetchCast = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
//           params: { api_key: API_KEY },
//         });

//         setCast(response.data.cast.slice(0, 5)); // Lấy 5 diễn viên đầu
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách diễn viên:", error);
//       }
//     };

//     fetchCast();
//   }, [movieId]);

//   return (
//     <div className="mt-6">
//       <h2 className="text-lg font-semibold text-center">Diễn viên</h2>
//       <div className="flex justify-center gap-4 mt-3">
//         {cast.map((actor) => (
//           <div key={actor.id} className="text-center">
//             <img
//               src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
//               alt={actor.name}
//               className="w-20 h-20 rounded-full object-cover border border-gray-700"
//             />
//             <p className="text-white mt-2 text-sm">{actor.name}</p>
//             <p className="text-gray-400 text-xs">{actor.character}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MovieCast;
