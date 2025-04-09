// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // tùy theo cấu trúc thư mục của bạn
    ],
    theme: {
      extend: {
        fontSize: {
          'xs': '0.75rem',
          'sm': '0.875rem',
          'base': '1rem',
          'lg': '1.125rem',
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
          'custom-lg': '2rem', // thêm kích thước mới
        },
        colors: {
          primary: '#1D4ED8', // màu xanh dương tùy chỉnh
          secondary: '#64748B', // màu xám xanh
          'custom-red': '#FF4C4C',
            'custom-orange': '#FF5524',
        },
      },
    },
    plugins: [],
  };
  