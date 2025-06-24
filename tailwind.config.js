export default {
    safelist:[],
    content: [],
    theme: {
        container:{
            center:true,
        },
        extend: {
            colors:{
                "prime-vue-error":"rgb(220 38 38)",
                primary: {
                    '50': '#f5f8f6',
                    '100': '#dfe8e3',
                    '200': '#bfd0c8',
                    '300': '#97b1a5',
                    '400': '#6f8d80',
                    '500': '#577569',
                    '600': '#445d53',
                    '700': '#394c44',
                    '800': '#313e3a',
                    '900': '#2b3632',
                    '950': '#161d1b',
                }
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ]
}